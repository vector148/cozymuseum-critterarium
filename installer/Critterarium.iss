#define AppName "CozyMuseum Critterarium"
#define AppVersion "3.0.2"

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
SetupIconFile=..\src-tauri\icons\icon.ico
WizardStyle=modern
DisableDirPage=yes
DisableProgramGroupPage=yes
LicenseFile=..\LICENSE

[Files]
Source: "..\.build\windows-payload\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion

[Icons]
Name: "{group}\CozyMuseum Critterarium"; Filename: "{app}\cozymuseum-critterarium.exe"; WorkingDir: "{app}"; IconFilename: "{app}\cozymuseum-critterarium.exe"
Name: "{userdesktop}\CozyMuseum Critterarium"; Filename: "{app}\cozymuseum-critterarium.exe"; WorkingDir: "{app}"; IconFilename: "{app}\cozymuseum-critterarium.exe"

[Run]
Filename: "{app}\cozymuseum-critterarium.exe"; Description: "Open CozyMuseum Critterarium"; Flags: nowait postinstall skipifsilent
