#define AppName "CozyMuseum Critterarium"
#define AppVersion "3.0.0"

[Setup]
AppId={{D430A7C9-28DE-49C3-98B6-3552B8567DA1}
AppName={#AppName}
AppVersion={#AppVersion}
AppPublisher=CozyMuseum
DefaultDirName={localappdata}\Programs\CozyMuseum Critterarium
DefaultGroupName=CozyMuseum Critterarium
OutputDir=..\.build\release
OutputBaseFilename=CozyMuseum-Critterarium-Setup
Compression=lzma2
SolidCompression=yes
PrivilegesRequired=lowest
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
UninstallDisplayName={#AppName}
WizardStyle=modern
DisableDirPage=yes
DisableProgramGroupPage=yes
LicenseFile=..\LICENSE

[Files]
Source: "..\.build\windows-payload\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Icons]
Name: "{group}\CozyMuseum Critterarium"; Filename: "{sys}\wscript.exe"; Parameters: """{app}\scripts\start-hidden.vbs"""; WorkingDir: "{app}"
Name: "{autodesktop}\CozyMuseum Critterarium"; Filename: "{sys}\wscript.exe"; Parameters: """{app}\scripts\start-hidden.vbs"""; WorkingDir: "{app}"

[Run]
Filename: "{sys}\wscript.exe"; Parameters: """{app}\scripts\start-hidden.vbs"""; Description: "Open CozyMuseum Critterarium"; Flags: nowait postinstall skipifsilent
