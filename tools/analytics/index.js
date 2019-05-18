'use strict';
const analytics = require('express').Router();
const postgres = require('../../common/postgres');

analytics.get('/tools/analytics/hitcount', async (req, res, next) => {
	try {
		let hits = 0;
		const dip = req.header('x-forwarded-for') ||  req.connection.remoteAddress;
		const site = req.query.site;
		if (site) {
			const ret = await postgres.exec(
				{
					database: 'postgres',
					text: 'id:total-web-site-hit',
					values: {
						asite_name: site,
						aip_address: ip
					}
				},
				{ req, res, next },
				false
			);
			if (ret.rows && ret.rows.length > 0) {
				hits = ret.rows[0].hits;
			}
		}
		res.json({ hits: hits });
	} catch (e) {
		console.log(e);
	}
});

module.exports = analytics;
