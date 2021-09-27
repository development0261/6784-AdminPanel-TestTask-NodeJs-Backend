var fs = require("fs");
var parser = require('xml2json');

async function xmlTojson(req, res) {
	try {
		res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR");

		fs.readFile( './jobTemplate.xml', function(err, data) {
			var json = JSON.parse(parser.toJson(data, {reversible: true}));

			let journal_meta = json.article.front['journal-meta'];
			let article_meta = json.article.front['article-meta'];

			let response = [{
					journal_info: {
							hwp: "",
							publisher_id: "",
							journal_title: "",
							Journal_title_abbrv: "",
							ppub_issn: "",
							epub_iisn: "",
							doi_prefix: "",
					},
					publisher_info: {
							publisher_name: "",
							publisher_address: "",
					},
					copyright_info: {
							copyright_statement: "",
							copyright_year: ""
					}
			}];

			journal_meta['journal-id'].forEach(element => {
					if(element['journal-id-type'] == 'hwp') {
							response[0].journal_info.hwp = element.$t;
					} else if(element['journal-id-type'] == 'publisher-id') {
							response[0].journal_info.publisher_id = element.$t;
					}
			});

			response[0].journal_info.journal_title = journal_meta['journal-title-group']['journal-title'].$t;
			response[0].journal_info.Journal_title_abbrv = journal_meta['journal-title-group']['abbrev-journal-title'].$t;
			
			journal_meta['issn'].forEach(element => {
					if(element['pub-type'] == 'ppub') {
							response[0].journal_info.ppub_issn = element.$t;
					} else if(element['pub-type'] == 'epub') {
							response[0].journal_info.epub_iisn = element.$t;
					}
			});

			response[0].journal_info.doi_prefix = article_meta['article-id'][0]['$t'];
			
			response[0].publisher_info.publisher_name = journal_meta['publisher']['publisher-name'].$t;
			response[0].publisher_info.publisher_address = journal_meta['publisher']['publisher-loc'].$t;
			
			response[0].copyright_info.copyright_statement = article_meta['permissions']['copyright-statement'].$t;
			response[0].copyright_info.copyright_year = article_meta['permissions']['copyright-year'].$t;

			res.json({"project_info": response, "message": "Data get Successfully."});
	});
	} catch (err) {
		console.log('****ERROR****', err);
	}
}

async function jsonToxml(req, res) {
	try {
		res.header("Access-Control-Allow-Origin", "*");
  	res.header("Access-Control-Allow-Headers", "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR");

		let project_info =  req.body.project_info;
    project_info.journal_info.hwp;

    fs.readFile( './jobTemplate.xml', function(err, data) {
			// Conver XML to JSON.
			var json = JSON.parse(parser.toJson(data, {reversible: true}));

			let journal_meta = json.article.front['journal-meta'];
			let article_meta = json.article.front['article-meta'];

			journal_meta['journal-id'].forEach(element => {
				if(element['journal-id-type'] == 'hwp') {
						element.$t = project_info.journal_info.hwp;
				} else if(element['journal-id-type'] == 'publisher-id') {
						element.$t = project_info.journal_info.publisher_id;
				}
			});
			journal_meta['journal-title-group']['journal-title'].$t = project_info.journal_info.journal_title;
			journal_meta['journal-title-group']['abbrev-journal-title'].$t = project_info.journal_info.Journal_title_abbrv;

			journal_meta['issn'].forEach(element => {
				if(element['pub-type'] == 'ppub') {
						element.$t = project_info.journal_info.ppub_issn;
				} else if(element['pub-type'] == 'epub') {
						element.$t = project_info.journal_info.epub_iisn;
				}
			});
			article_meta['article-id'][0]['$t'] = project_info.journal_info.doi_prefix;

			journal_meta['publisher']['publisher-name'].$t = project_info.publisher_info.publisher_name;
			journal_meta['publisher']['publisher-loc'].$t = project_info.publisher_info.publisher_address;

			article_meta['permissions']['copyright-statement'].$t = project_info.copyright_info.copyright_statement;
			article_meta['permissions']['copyright-year'].$t = project_info.copyright_info.copyright_year;

			// Conver JSON to XML.
			var stringified = JSON.stringify(json);
			var xml = parser.toXml(stringified);
			
			fs.writeFile('./jobTemplate.xml', xml, function(err, data) {
				if (err) {
						res.json({"status": false, "error": err});
				}
				else {
						res.json({"status": true, "message": "XML File updated successfully."});
				}
			});
    });
	} catch (err) {
		console.log('****ERROR****', err);
	}
}

module.exports = {
	xmlTojson,
	jsonToxml
}