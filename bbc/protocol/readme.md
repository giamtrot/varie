bbcnews://test?param=123

## Custom Protocol Handler Setup

This project includes PowerShell scripts to register and unregister a custom URL protocol (`bbcnews://`) that launches the `print_params_exe.exe` application.

### Installation

To register the `bbcnews://` protocol handler, run the `register_protocol.ps1` script from an **elevated PowerShell prompt**.

You can run it with default values:

```powershell
.\register_protocol.ps1
```

Or, specify custom parameters:

```powershell
.\register_protocol.ps1 -ProtocolName "myprotocol" -ProtocolDescription "My Custom Protocol" -ExeName "my_app.exe"
```

The script will automatically attempt to elevate itself if not run as an administrator.

### Uninstallation

To unregister the `bbcnews://` protocol handler, run the `unregister_protocol.ps1` script from an **elevated PowerShell prompt**.

You can run it with the default protocol name:

```powershell
.\unregister_protocol.ps1
```

Or, specify a custom protocol name if you used one during registration:

```powershell
.\unregister_protocol.ps1 -ProtocolName "myprotocol"
```

### Querying the registry by command line
```
reg query HKCR\bbcnews /s
reg query HKCU\Software\Classes\bbcnews /s
```

### Testing the Protocol

After installation, you can test the protocol by typing `bbcnews://test` (or your custom protocol, e.g., `myprotocol://test`) in your web browser's address bar or in the Windows Run dialog (`Win + R`).
The `print_params_exe.exe` application should launch and display the parameters passed to it.

```

