<#
.SYNOPSIS
    Unregisters a custom URL protocol.
.DESCRIPTION
    This PowerShell script removes the Windows Registry keys associated
    with a custom URL protocol, for either the current user or all users.
.PARAMETER Mode
    The installation mode to uninstall. 'global' for all users (requires admin), 'user' for the current user only.
.PARAMETER ProtocolName
    The name of the protocol to unregister (e.g., "bbcnews").
#>
param(
    [ValidateSet("user", "global")]
    [string]$Mode = "global",
    [string]$ProtocolName = "bbcnews"
)

function Remove-ProtocolRegistryKeys {
    param(
        [string]$ProtocolName,
        [string]$Mode
    )

    $globalKeyPath = "Registry::HKEY_CLASSES_ROOT\$ProtocolName"
    $userKeyPath = "Registry::HKEY_CURRENT_USER\Software\Classes\$ProtocolName"

    try {
        Write-Host "Removing registry entries for ${ProtocolName}:// protocol..."
        Write-Host "Uninstallation Mode: $Mode"

        # If global mode, attempt to remove the main key from HKEY_CLASSES_ROOT (HKLM)
        if ($Mode -eq "global") {
            if (Test-Path $globalKeyPath) {
                Remove-Item -Path $globalKeyPath -Recurse -Force
                Write-Host "Removed $globalKeyPath"
            }
            else {
                Write-Host "$globalKeyPath not found."
            }
        }
        
        # 'user' mode should ensure the HKEY_CURRENT_USER key is removed.
        if ($Mode -eq "user") {
            if (Test-Path $userKeyPath) {
                Remove-Item -Path $userKeyPath -Recurse -Force
                Write-Host "Removed $userKeyPath"
            }
            else {
                Write-Host "$userKeyPath not found."
            }
        }

        Write-Host "Registry entries removed successfully."
        return $true
    }
    catch {
        Write-Error "An error occurred while removing registry entries: $_"
        return $false
    }
}

# --- Main Script Body ---

# Self-elevate the script if in global mode and not running as an administrator
if ($Mode -eq "global" -and -NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "Administrator privileges are required for global uninstallation. Attempting to re-launch as administrator..."
    try {
        $argumentList = @(
            "-NoProfile",
            "-ExecutionPolicy", "Bypass",
            "-File", "`"$PSCommandPath`"",
            "-Mode", "`"$Mode`"",
            "-ProtocolName", "`"$ProtocolName`""
        )
        Start-Process PowerShell.exe -Verb RunAs -ArgumentList $argumentList
        exit
    }
    catch {
        Write-Error "Failed to re-launch as administrator. Please run this script from an elevated PowerShell prompt for global uninstallation."
        Read-Host "An error occurred. Press Enter to exit"
        exit 1
    }
}

$success = Remove-ProtocolRegistryKeys -ProtocolName $ProtocolName -Mode $Mode

if (-not $success) {
    Read-Host "An error occurred. Press Enter to exit"
    exit 1
}

Read-Host "Uninstallation complete. Press Enter to exit"