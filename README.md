This is a facilitator script/software for applications used across MGRM to read OmVcard numbers from OmVcards connected to card readers.

## Run
```
npm install
node index.js
```
- If a card reader is connected, and it has a valid OmVcard, you should be able to get a JSON with the corresponding OmVcard number when you visit the URL http://localhost:1790

## Building Executables
- You can use `pkg` to build executables for a specified target. For instance, if you want a Windows executable:
```
pkg -t node12-win .
```
- Ensure pkg is available before running the above command, you can get it using:
```
npm install -g pkg
```

## Notes on building executables
- Since a package (`pcsclite`) used in this repository has its own build step which varies as per the target where it is being built (Windows, Linux); it is imperative that you build a particular executable on that specific target.
- If you want a Windows executable, run the `pkg` build step (including the installation of node modules — `npm install`) on  Windows
