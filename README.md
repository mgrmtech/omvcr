This is a facilitator script/software for applications used across MGRM to read OmVcard numbers from OmVcards connected to card readers.

### Run
- Install the requisite node modules, and then run `index.js`:
```
npm install
node index.js
```
- If a card reader is connected, and it has a valid OmVcard, you should be able to get a JSON with the corresponding OmVcard number when you visit the URL http://localhost:1790.

### Building Executables
- Ensure pkg is available globally:
```
npm install -g pkg
```
- You can use `pkg` to build executables for a specified target. For instance, if you want a Windows executable:
```
pkg -t node12-win .
```


### Notes on building executables
- Since a package (`pcsclite`) used in this repository has its own build step; and since the build varies as per the target (Windows/Linux), it is imperative that you build a particular target's executable on that specific target.
- To put it in a simpler way, if you want a Windows executable, run the `pkg` build step (including the installation of node modules — `npm install`) on  Windows.

### Miscellaneous/Help
- [GitHub Gist: Configuring Windows 10 (64-bit) for npm and node-gyp](https://gist.github.com/jtrefry/fd0ea70a89e2c3b7779c)