Add-Type -AssemblyName System.Drawing

$source = "assets\taksasattalek_cover.png"
$target = "assets\taksasattalek_cover_optimized.jpg"

$img = [System.Drawing.Image]::FromFile($source)
$newWidth = 1000
$newHeight = 1414

$bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
$graphics.Dispose()

# JPEG Encoder and Quality
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]50)

$bmp.Save($target, $jpegCodec[0], $encoderParams)

$bmp.Dispose()
$img.Dispose()
