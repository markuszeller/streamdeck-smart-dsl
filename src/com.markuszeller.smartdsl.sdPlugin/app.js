"use strict";

import {Crypt} from './modules/Crypt.js';
import {Canvas} from './modules/Canvas.js';
import {Settings} from './modules/Settings.js';
import {App} from './modules/App.js';

const app = new App(
    30_000,
    new Crypt(),
    new Canvas(),
    new Action('com.markuszeller.smartdsl.action'),
    new Settings()
);
