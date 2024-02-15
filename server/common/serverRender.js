import React from 'react';
import { resolve } from 'path';
import fs from 'fs';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { matchPath } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import PublicRoutes from '../../shared/PublicRoutes.js';
import AdminRoutes from '../../shared/AdminRoutes.js';
import { App } from '../../src/App.js';

const getRequestPath = (path, url) => {
    let newPath = '';
    if (path.startsWith('/api')) {
        newPath = path;
    } else if (url.includes('ingatlan?id=')) {
        newPath = '/api' + url;
    } else {
        switch (path) {
            case '/': {
                newPath = '/api/ingatlan';
                break;
            }
            case '/ingatlanok': {
                newPath = '/api/ingatlan';
                break
            }

        }
    }

    return newPath;
};

export default () => (req, res) => {
    const allRoutes = PublicRoutes.concat(AdminRoutes);
    let aR = [];
    allRoutes.forEach((route) => {
        if (route.children) {
            aR = route.children.filter((subroute) => matchPath(subroute.path, req.path));
        } else {
            if (matchPath(req.path, route.path)) {
                aR = [route];
            }
        }
    });
    const activeRoute = aR[0] || {};
    const newPath = getRequestPath(req.path, req.url, req.originalUrl);
    const promise = activeRoute.fetchInitialData ? activeRoute.fetchInitialData(newPath) : Promise.resolve();

    const filePath = resolve(__dirname, '..', 'build/public', 'index.html');

    if (req.url.startsWith('/admin') && !req.cookies.JWT_TOKEN) {
        return res.redirect('/login');
    }

    fs.readFile(filePath, 'utf8', (err, htmlData) => {
        if (err) {
            return res.status(404).end();
        }

        if (req.url.startsWith('/admin') && !req.cookies.JWT_TOKEN) {
            return res.redirect('/login');
        }

        return promise
            .then(async (data) => {
                const context = { data };
                const markup = ReactDOMServer.renderToString(
                    <StaticRouter location={req.path} context={context}>
                        <App history={{}} />
                    </StaticRouter>
                );
                /* const initialData = `window.__INITIAL_DATA__ = ${data ? JSON.stringify(data) : JSON.stringify([])}`; */
                const helmet = Helmet.renderStatic();
                let resx;
                if (data) {
                    resx = res.send(
                        htmlData
                            .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
                            .replace('<title>MyHome - Ingatlanközvetítő iroda</title>', helmet.title.toString() + helmet.meta.toString())
                            .replace('<noscript>You need to enable JavaScript to run this app.</noscript>', '')
                            .replace('</head>', '<script>' + initialData + '</script>' + '</head>')
                            .replace('__OG_TITLE__', data && Array.isArray(data) && data.length > 0 && data[0].cim)
                            .replace('__OG_DESCRIPTION__', data && Array.isArray(data) && data.length > 0 && data[0].leiras)
                            .replace('__OG_URL__', data && Array.isArray(data) && data.length > 0 && process.env.REACT_APP_url + data[0].id)
                            .replace(
                                '__OG_IMAGE__',
                                data && Array.isArray(data) && data.length > 0 && data[0].kepek && Array.isArray(data[0].kepek) && data[0].kepek.length > 0 && data[0].kepek[0].src
                            )
                    );
                } else {
                    resx = res.send(
                        htmlData
                            .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
                            .replace('<title>MyHome - Ingatlanközvetítő iroda</title>', helmet.title.toString() + helmet.meta.toString())
                            .replace('<noscript>You need to enable JavaScript to run this app.</noscript>', '')
                    );
                }

                return resx;
            })
            .catch((error) => console.log('errrrrr: ', error));
    });
};
