Set shell = CreateObject("WScript.Shell")
Set files = CreateObject("Scripting.FileSystemObject")
root = files.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = root
shell.Run Chr(34) & root & "\node.exe" & Chr(34) & " " & Chr(34) & root & "\scripts\desktop-server.mjs" & Chr(34), 0, False
