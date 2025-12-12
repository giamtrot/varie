<#
.SYNOPSIS
    Registers a custom URL protocol to launch a specified application.
.DESCRIPTION
    This PowerShell script automates the creation of Windows Registry keys
    for a custom URL protocol. It can register for the current user or
    for all users (globally), which requires administrator rights.
.PARAMETER Mode
    The installation mode. 'global' for all users (requires admin), 'user' for the current user only.
.PARAMETER ProtocolName
    The name of the protocol (e.g., "bbcnews").
.PARAMETER ProtocolDescription
    The description of the protocol (e.g., "BBC News Protocol").
.PARAMETER ExeName
    The name of the executable file (e.g., "print_params_exe.exe").
#>
param(
    [ValidateSet("user", "global")]
    [string]$Mode = "global",
    [string]$ProtocolName = "bbcnews",
    [string]$ProtocolDescription = "BBC News Protocol",
    [string]$ExeName = "BBCNews.exe"
)

function Set-Global-ProtocolRegistryKeys {
    param(
        [string]$ProtocolName,
        [string]$ProtocolDescription,
        [string]$ExePath
    )

    # When elevated, writing to HKCR writes to HKLM\Software\Classes
    $baseRegPath = "Registry::HKEY_CLASSES_ROOT"
    $protocolKeyPath = Join-Path -Path $baseRegPath -ChildPath $ProtocolName

    try {
        Write-Host "Creating registry entries for ${ProtocolName}:// protocol in $baseRegPath..."

        # Main protocol key
        if (-NOT (Test-Path $protocolKeyPath)) {
            New-Item -Path $protocolKeyPath -Force | Out-Null
        }
        Set-ItemProperty -Path $protocolKeyPath -Name "(Default)" -Value "URL:$ProtocolDescription" -Force
        Set-ItemProperty -Path $protocolKeyPath -Name "URL Protocol" -Value "" -Force

        # Default icon
        $iconPath = Join-Path -Path $protocolKeyPath -ChildPath "DefaultIcon"
        if (-NOT (Test-Path $iconPath)) {
            New-Item -Path $iconPath -Force | Out-Null
        }
        Set-ItemProperty -Path $iconPath -Name "(Default)" -Value "$ExePath,1" -Force
       
        # Shell open command
        $commandPath = Join-Path -Path $protocolKeyPath -ChildPath "shell\open\command"
        if (-NOT (Test-Path $commandPath)) {
            New-Item -Path $commandPath -Force | Out-Null
        }
        Set-ItemProperty -Path $commandPath -Name "(Default)" -Value "`"$ExePath`" `"%1`"" -Force


        Write-Host "Registry entries created successfully."
        Write-Host "You can now test the protocol by opening a URL like '${ProtocolName}://test'"
        return $true
    }
    catch {
        Write-Error "An error occurred while writing to the registry: $_"
        return $false
    }
}

function Set-User-ProtocolRegistryKeys {
    param(
        [string]$ProtocolName
    )

    # When elevated, writing to HKCR writes to HKLM\Software\Classes
    $baseRegPath = "Registry::HKEY_CURRENT_USER\Software\Classes"
    $protocolKeyPath = Join-Path -Path $baseRegPath -ChildPath $ProtocolName

    try {
        Write-Host "Creating registry entries for ${ProtocolName}:// protocol in $baseRegPath..."

        # User-specific settings always go to HKCU
        Write-Host "Applying user-specific settings to $protocolKeyPath..."
        if (-NOT (Test-Path $protocolKeyPath)) {
            New-Item -Path $protocolKeyPath -Force | Out-Null
        }
        Set-ItemProperty -Path $protocolKeyPath -Name "EditFlags" -Value 2 -Type DWord -Force
        Set-ItemProperty -Path $protocolKeyPath -Name "BrowserFlags" -Value 8 -Type DWord -Force

        Write-Host "Registry entries created successfully."
        return $true
    }
    catch {
        Write-Error "An error occurred while writing to the registry: $_"
        return $false
    }
}

# --- Main Script Body ---

# Self-elevate the script if in global mode and not running as an administrator
if ($Mode -eq "global" -and -NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Administrator privileges are required for global installation. Attempting to re-launch as administrator..."
    try {
        $argumentList = @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", "`"$PSCommandPath`"",
            "-Mode", "`"$Mode`"",
            "-ProtocolName", "`"$ProtocolName`"",
            "-ProtocolDescription", "`"$ProtocolDescription`"",
            "-ExeName", "`"$ExeName`""
        )
        Start-Process PowerShell.exe -Verb RunAs -ArgumentList $argumentList
        exit
    }
    catch {
        Write-Error "Failed to re-launch as administrator. Please run this script from an elevated PowerShell prompt for global installation."
        Read-Host "An error occurred. Press Enter to exit"
        exit 1
    }
}

# Get the directory where this script is located
$scriptRoot = $PSScriptRoot
Write-Host "Script running from: $scriptRoot"
Write-Host "Installation Mode: $Mode"

# Construct the full path to the executable
$exePath = Join-Path -Path $scriptRoot -ChildPath "dist\$ExeName"

# Check if the executable exists
if (-NOT (Test-Path -Path $exePath -PathType Leaf)) {
    Write-Error "Executable not found at '$exePath'. Please ensure the script is in the correct project root directory and the project has been built."
    Read-Host "An error occurred. Press Enter to exit"
    exit 1
}

Write-Host "Found executable at: $exePath"

if ($Mode -eq "global") {
    $success = Set-Global-ProtocolRegistryKeys -ProtocolName $ProtocolName -ProtocolDescription $ProtocolDescription -ExePath $exePath
}
else {
    $success = Set-User-ProtocolRegistryKeys -ProtocolName $ProtocolName
}


if (-not $success) {
    Read-Host "An error occurred. Press Enter to exit"
    exit 1
}

Read-Host "Installation complete. Press Enter to exit"