const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
	const pcsc = require("pcsclite")();
	const sendResponse = (err, data) => !res._headerSent ? res.json({ err, data }) : null;

	setTimeout(() => {
		if (Object.keys(pcsc.readers).length === 0) {
			sendResponse("No card reader(s) available!");
		}
	}, 500);
	
	pcsc.on("reader", reader => {
		reader.on("error", err => sendResponse(err));

		reader.on("status", function(status) {
			/* Check what has changed */
			const changes = this.state ^ status.state;
			if (changes) {
				if ( // Card removed/absent from the reader
					changes & this.SCARD_STATE_EMPTY &&
					status.state & this.SCARD_STATE_EMPTY
				) {
					// reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {});
					sendResponse("No card(s) available!");
				} else if ( // Card inserted/present inside the reader
					changes & this.SCARD_STATE_PRESENT &&
					status.state & this.SCARD_STATE_PRESENT
				) {
					reader.connect(
						{ share_mode: this.SCARD_SHARE_SHARED },
						(err, protocol) => {
							if (err) {
								sendResponse(err);
								return;
							}
							reader.transmit(
								Buffer.from([
									0x00, 0xA4, 0x04, 0x00, 0x0F,
									0x4D, 0x53, 0x54, 0x41, 0x52,
									0x48, 0x45, 0x53, 0x50, 0x45,
									0x52, 0x53, 0x41, 0x50, 0x50,
								]),
								255,
								/* FIX: `protocol` stays undefined; when the card is removed, and inserted */
								protocol || 2,
								(err, data) => {
									if (err) {
										sendResponse(err);
										return;
									}
									reader.transmit(
										Buffer.from([0x90, 0x16, 0x00, 0x00, 0x10]),
										255,
										/* FIX: `protocol` stays undefined; when the card is removed, and inserted */
										protocol || 2,
										(err2, data2) => sendResponse(err2, data2.toString().substring(0, 16)),
									);
								}
							);
						}
					);
				}
			}
		});
		// reader.on("end", function() { console.log("Reader", this.name, "removed"); });
	});

	pcsc.on("error", err => sendResponse(err));
});

app.listen(1790, () => console.log("Listening for OmVcard number requests on port 1790..."));

