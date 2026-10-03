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
SetupIconFile=..\src-tauri\icons\icon.ico
WizardStyle=modern
DisableDirPage=no
DisableProgramGroupPage=yes
LicenseFile=..\LICENSE

[Files]
Source: "..\.build\windows-payload\*"; DestDir: "{app}"; Flags: recursesubdirs createallsubdirs ignoreversion
Source: "..\src-tauri\icons\icon.ico"; DestDir: "{app}"; DestName: "critterarium-mark.ico"; Flags: ignoreversion

[Icons]
Name: "{group}\CozyMuseum Critterarium"; Filename: "{app}\cozymuseum-critterarium.exe"; WorkingDir: "{app}"; IconFilename: "{app}\critterarium-mark.ico"
Name: "{userdesktop}\CozyMuseum Critterarium"; Filename: "{app}\cozymuseum-critterarium.exe"; WorkingDir: "{app}"; IconFilename: "{app}\critterarium-mark.ico"

[Run]
Filename: "{app}\cozymuseum-critterarium.exe"; Description: "Open CozyMuseum Critterarium"; Flags: nowait postinstall skipifsilent
