This is a facilitator script/software for applications used across MGRM; to read OmVcard numbers, from OmVcards connected to card readers.

### Run
- Install the requisite node modules, and then run `index.js`:
```
npm install
node index.js
```
- If a card reader is connected, and it has a valid OmVcard, we should be able to get a JSON with the corresponding OmVcard number when we visit this URL — http://localhost:1790.

### Build binaries
- Ensure pkg is available globally:
```
npm install -g pkg
```
- We can use `pkg` to build binaries/executables for a specified target. For instance, if we want a Windows binary/executable, we run:
```
pkg -t node12-win .
```


### Notes on building
- Since a package (`pcsclite`) used in this repository has its own build step; and since the build varies as per the target (Windows/Linux), it is imperative that we build a particular target's executable on that specific target.
- To put it in a simpler way, if we want a Windows executable, we run the `pkg` build step (including the installation of node modules — `npm install`) on  Windows.

### Miscellaneous/Help
- [GitHub Gist: Configuring Windows 10 (64-bit) for node-gyp](https://gist.github.com/jtrefry/fd0ea70a89e2c3b7779c)
- [GitHub Gist: Configuring Windows (32-bit) for node-gyp](https://gist.github.com/fatman-/26c34fadf6344277410fb875c75de515)
