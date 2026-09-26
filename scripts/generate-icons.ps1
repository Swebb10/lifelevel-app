# Regenerates the code-drawn LifeLevel monogram; no external image dependencies.
Add-Type -AssemblyName System.Drawing
$assetRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '../public'))
[IO.Directory]::CreateDirectory($assetRoot) | Out-Null
foreach ($asset in @(@{ Name='icon-192.png'; Size=192 }, @{ Name='icon-512.png'; Size=512 }, @{ Name='icon-maskable-512.png'; Size=512 }, @{ Name='apple-touch-icon.png'; Size=180 })) {
    $size = $asset.Size
    $bitmap = New-Object Drawing.Bitmap($size, $size)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([Drawing.ColorTranslator]::FromHtml('#101211'))
    $pen = New-Object Drawing.Pen([Drawing.ColorTranslator]::FromHtml('#d1dfaa'), ($size * 0.065))
    $pen.StartCap = $pen.EndCap = [Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [Drawing.Drawing2D.LineJoin]::Round
    # All strokes remain within the central maskable safe circle.
    $graphics.DrawLine($pen, [single]($size*.31), [single]($size*.32), [single]($size*.31), [single]($size*.68))
    $graphics.DrawLine($pen, [single]($size*.31), [single]($size*.68), [single]($size*.58), [single]($size*.68))
    $graphics.DrawLine($pen, [single]($size*.49), [single]($size*.51), [single]($size*.69), [single]($size*.31))
    $graphics.DrawLine($pen, [single]($size*.53), [single]($size*.31), [single]($size*.69), [single]($size*.31))
    $graphics.DrawLine($pen, [single]($size*.69), [single]($size*.31), [single]($size*.69), [single]($size*.47))
    $bitmap.Save((Join-Path $assetRoot $asset.Name), [Drawing.Imaging.ImageFormat]::Png)
    $pen.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}
