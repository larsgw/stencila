"use strict";

var DocumentEngineBase = require('substance/collab/DocumentEngine');
var ObjectOperation = require('substance/model/data/ObjectOperation');
var JSONConverter = require('substance/model/JSONConverter');
var Err = require('substance/util/SubstanceError');

function DocumentEngine(config) {
  DocumentEngine.super.apply(this, arguments);

  this.modelFactory = config.modelFactory;
}

DocumentEngine.Prototype = function() {

  this.getDocument = function(args, cb) {

    this.documentStore.documentExists(args.documentId, function(err, exists) {
      if (exists) {
        // If the jam exists then just get it from the snapshot engine
        this.snapshotEngine.getSnapshot(args, cb);
      } else {
        // Otherwise, we need to create a jam by importing the document...
        
        var address = 'tests/document/nodes/paragraph';

        // Resolve the Stencila address into a Stencila component type
        // TDO
        var schemaName = 'stencila-document';

        // Read the document from repository
        this.modelFactory.readDocument(address, function(err, doc) {
          if(err) return cb(new Err('ReadError', { cause: err }));

          // We start with version 1 because version 0 is assumed to be empty and
          // is treated specially by Substance `SnapshotEngine`
          var version = 1;
          var json = this.modelFactory.exportJson(doc);

          // Create a record in the `DocumentStore`
          this.documentStore.createDocument({
            schemaName: schemaName,
            documentId: args.documentId,
            version: version
          }, function(err, documentRecord) {
            if(err) return cb(new Err('CreateError', { cause: err }));

            // Create a change in the `ChangeStore` so that version 1 has 
            // one change associated with it
            this.changeStore.addChange({
              documentId: args.documentId,
              change: {
                ops: [
                  {type: ObjectOperation.NOP}
                ]
              }
            }, function(err, version) {
              if(err) return cb(new Err('CreateError', { cause: err }));

              // Create a snapshot of the document
              // Necessary because our version 1 of a document actually has stuff in it
              // and we want to use it as the "baseline" when snapshots are requested
              this.snapshotEngine.createSnapshot(args.documentId, version, function() {
                if(err) return cb(new Err('ShapshotError', { cause: err }));

                cb(null, {
                  documentId: documentRecord.documentId,
                  version: documentRecord.version,
                  data: json,
                });

              });

            }.bind(this));

          }.bind(this));

        }.bind(this));

      }

    }.bind(this));

  };

};

DocumentEngineBase.extend(DocumentEngine);

module.exports = DocumentEngine;