#!/usr/bin/env php
<?php
declare(strict_types=1);

const PLUGIN   = 'com.markuszeller.smartdsl.sdPlugin';
const STREAMDECK_EXTENSION = '.streamDeckPlugin';
const MANIFEST = 'manifest.json';

chdir('src');
$json = json_decode(file_get_contents(PLUGIN . DIRECTORY_SEPARATOR . MANIFEST), false);
[$major, $minor, $build] = explode('.', $json->Version);
$json->Version = sprintf('%d.%d.%d', $major, $minor, ++$build);
file_put_contents(PLUGIN . DIRECTORY_SEPARATOR . MANIFEST, json_encode($json, JSON_PRETTY_PRINT));

system('zip -r ../' . PLUGIN . STREAMDECK_EXTENSION . ' ' . PLUGIN . '/*');
