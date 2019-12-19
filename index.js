const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const _sendResult = (error, omvCardNum, reader, pcsc, res) => {
	if (error) {
		res.send("There has been an error with the card reader!" + error);
		reader.close();
		pcsc.close();
		return;
	}
	else {
		res.send(omvCardNum);
		reader.close();
		pcsc.close();
	}
}

app.get("/", (req, res) => {
	const pcsc = require("pcsclite")();
	pcsc.on("reader", function(reader) {
		console.log("Reader detected", reader.name);

		reader.on("error", function(err) {
			console.log("Error(", this.name, "):", err.message);
			sendResult(err);
		});

		reader.on("status", function(status) {
			/* Setting defaults */
			const sendResult = (
				error = null,
				omvCardNum = "NA",
				_reader = reader,
				_pcsc = pcsc,
				_res = res,
			) => _sendResult(error, omvCardNum, _reader, _pcsc, _res);
			console.log("Status(", this.name, "):", status);

			/* check what has changed */
			const changes = this.state ^ status.state;
			if (changes) {
				if (
					changes & this.SCARD_STATE_EMPTY &&
					status.state & this.SCARD_STATE_EMPTY
				) {
					console.log("card removed"); /* card removed */
					reader.disconnect(reader.SCARD_LEAVE_CARD, function(err) {
						if (err) {
							console.log(err);
							sendResult(err);
						} else {
							console.log("Disconnected");
							sendResult("Disconnected");
						}
					});
				} else if (
					changes & this.SCARD_STATE_PRESENT &&
					status.state & this.SCARD_STATE_PRESENT
				) {
					console.log("card inserted"); /* card inserted */
					reader.connect({ share_mode: this.SCARD_SHARE_SHARED }, function(
						err,
						protocol
					) {
						if (err) {
							console.log(err);
							sendResult(err);
						} else {
							console.log("Protocol(", reader.name, "):", protocol);
							reader.transmit(
								Buffer.from([
									0x00, 0xA4, 0x04, 0x00, 0x0F,
									0x4D, 0x53, 0x54, 0x41, 0x52,
									0x48, 0x45, 0x53, 0x50, 0x45,
									0x52, 0x53, 0x41, 0x50, 0x50,
								]),
								255,
								protocol,
								function(err, data) {
									if (err) {
										console.log(err);
										sendResult(err);
									} else {
										reader.transmit(
											Buffer.from([0x90, 0x16, 0x00, 0x00, 0x10]), 255, protocol,
											function (err2, data2) {
												if (err2) {
													sendResult(err2);
												} else {
													console.log("Data received", data2.toString());
													sendResult(err2, data2.toString());
												}
											}
										);
									}
								}
							);
						}
					});
				}
			}
		});

		reader.on("end", function() {
			console.log("Reader", this.name, "removed");
		});
	});

	pcsc.on("error", function(err) {
		console.log("PCSC error", err.message);
	});
});
app.listen(1790, () => console.log("Listening for card requests on port 1790!"));

