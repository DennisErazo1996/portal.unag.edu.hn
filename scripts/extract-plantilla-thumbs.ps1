# Extrae miniaturas incrustadas de las plantillas (.docx/.pptx) hacia public/img/plantillas.
# Uso: pwsh -File scripts/extract-plantilla-thumbs.ps1
# Idempotente: sobrescribe las salidas existentes.

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = Split-Path -Parent $PSScriptRoot
$plantillasDir = Join-Path $root 'public\documents\plantillas'
$outDir = Join-Path $root 'public\img\plantillas'

if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir -Force | Out-Null
}

$targets = Get-ChildItem -Recurse $plantillasDir -Include *.docx, *.pptx |
    Where-Object { $_.DirectoryName -match '\\(diplomas|portadas|presentaciones)$' }

foreach ($file in $targets) {
    $ext = $file.Extension.ToLowerInvariant()
    $baseName = [IO.Path]::GetFileNameWithoutExtension($file.Name)

    $zip = [IO.Compression.ZipFile]::OpenRead($file.FullName)
    try {
        if ($ext -eq '.pptx') {
            $entry = $zip.Entries | Where-Object { $_.FullName -eq 'docProps/thumbnail.jpeg' }
        } else {
            $entry = $zip.Entries | Where-Object { $_.FullName -like 'word/media/image1.*' } | Select-Object -First 1
        }

        if (-not $entry) {
            throw "No se encontro miniatura esperada dentro de $($file.Name)"
        }

        $entryExt = [IO.Path]::GetExtension($entry.FullName).ToLowerInvariant()
        if ($entryExt -eq '.jpg') { $entryExt = '.jpeg' }
        $outPath = Join-Path $outDir "$baseName$entryExt"

        $stream = $entry.Open()
        try {
            $fileStream = [IO.File]::Create($outPath)
            try {
                $stream.CopyTo($fileStream)
            } finally {
                $fileStream.Dispose()
            }
        } finally {
            $stream.Dispose()
        }

        Write-Host "OK  $($file.Name) -> img/plantillas/$baseName$entryExt"
    } finally {
        $zip.Dispose()
    }
}

Write-Host "Listo. $($targets.Count) miniaturas extraidas."
