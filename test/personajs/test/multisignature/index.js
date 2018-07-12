var Buffer = require("buffer/").Buffer;
var should = require("should");
var persona = require("../../index.js");
var constants = require("../../lib/constants.js");

describe("multisignature.js", function () {

  var multisignature = persona.multisignature;

  it("should be ok", function () {
    (multisignature).should.be.ok;
  });

  it("should be object", function () {
    (multisignature).should.be.type("object");
  });

  it("should have properties", function () {
    (multisignature).should.have.property("createMultisignature");
  });

  describe("#createMultisignature", function () {
    var createMultisignature = multisignature.createMultisignature;
    var sgn = null;
    var keysgroup = ["+03a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933", "+13a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933", "+23a02b9d5fdd1307c2ee4652ba54d492d1fd11a7d1bb3f3a44c4a05e79f19de933"];

    it("should be function", function () {
      (createMultisignature).should.be.type("function");
    });

    it("should create multisignature transaction", function () {
      sgn = createMultisignature("secret", "second secret", keysgroup, 255, 2);
      (sgn).should.be.ok;
      (sgn).should.be.type("object");
    });

    it("should create multisignature transaction from keys", function () {
      var secretKey = persona.ECPair.fromSeed("secret");
      secretKey.publicKey = secretKey.getPublicKeyBuffer().toString("hex");

      var secondSecretKey = persona.ECPair.fromSeed("second secret");
      secondSecretKey.publicKey = secondSecretKey.getPublicKeyBuffer().toString("hex");

      sgn = createMultisignature(secretKey, secondSecretKey, keysgroup, 255, 2);
      (sgn).should.be.ok;
      (sgn).should.be.type("object");
    });

    it ("should have the correct multisignature fee", function () {
      sgn = createMultisignature('secret', 'second secret', keysgroup, 255, 2);
      sgn['fee'].should.equal((keysgroup.length + 1) * constants.fees.multisignature);
    });

    it("should be deserialised correctly", function () {
      sgn = createMultisignature('secret key', 'second secret key', keysgroup, 255, 2);
      var deserialisedTx = persona.crypto.fromBytes(persona.crypto.getBytes(sgn).toString("hex"));
      delete deserialisedTx.vendorFieldHex;
      var keys = Object.keys(deserialisedTx)
      for(key in keys){
        if(keys[key] == "asset"){
          deserialisedTx.asset.multisignature.min.should.equal(sgn.asset.multisignature.min);
          deserialisedTx.asset.multisignature.lifetime.should.equal(sgn.asset.multisignature.lifetime);
          deserialisedTx.asset.multisignature.keysgroup.length.should.equal(sgn.asset.multisignature.keysgroup.length);
          console.log(JSON.stringify(deserialisedTx.asset.multisignature.keysgroup));
          deserialisedTx.asset.multisignature.keysgroup[0].should.equal(sgn.asset.multisignature.keysgroup[0]);
          deserialisedTx.asset.multisignature.keysgroup[1].should.equal(sgn.asset.multisignature.keysgroup[1]);
          deserialisedTx.asset.multisignature.keysgroup[2].should.equal(sgn.asset.multisignature.keysgroup[2]);
        }
        else {
          deserialisedTx[keys[key]].should.equal(sgn[keys[key]]);
        }
      }
    });

    describe("returned multisignature transaction", function () {
      it("should have empty recipientId", function () {
        (sgn).should.have.property("recipientId").equal(null);
      });

      it("should have amount equal 0", function () {
        (sgn.amount).should.be.type("number").equal(0);
      });

      it("should have asset", function () {
        (sgn.asset).should.be.type("object");
        (sgn.asset).should.be.not.empty;
      });

      it("should have multisignature inside asset", function () {
        (sgn.asset).should.have.property("multisignature");
      });

      describe("multisignature asset", function () {
        it("should be ok", function () {
          (sgn.asset.multisignature).should.be.ok;
        })

        it("should be object", function () {
          (sgn.asset.multisignature).should.be.type("object");
        });

        it("should have min property", function () {
          (sgn.asset.multisignature).should.have.property("min");
        });

        it("should have lifetime property", function () {
          (sgn.asset.multisignature).should.have.property("lifetime");
        });

        it("should have keysgroup property", function () {
          (sgn.asset.multisignature).should.have.property("keysgroup");
        });

        it("should have 3 keys keysgroup", function () {
          (sgn.asset.multisignature.keysgroup.length).should.be.equal(3);
        });
      });
    });
  });

});
