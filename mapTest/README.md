## Introduction
This project is based on vue3+vite+ts

It's a simple Map demo using [vue-leaflet](https://github.com/vue-leaflet/vue-leaflet), which is a encapsulation of [leaflet](https://leafletjs.com/).


## What does it look like


## Structure
The main file of this project

    mapTest/src/views/MapTestView.vue

A simple encapsulation of mock

    mapTest/src/plugins/mock.plugin.ts

Some utils

    mapTest/src/utils

components

    mapTest/src/components/maps


## How to use

### The top left part contains 4 parts:

search, recommended locations, buttom, timezone

### Search

If you don't type in anything and start search directly, you are going to locate yourself using

    navigator.geolocation.getCurrentPosition

If you type sth, a street name for eg, It starts a req to bing service. Well, it's sometimes not that accurate if the value were too simple.

### Recommended locations

It's a simple dropdown that shows some places that is "Recommended", just chose one and check what happend

### buttom
Just a search btn. oh, you can click the btn or press enter after you type in sth in the input before to start searching.

### timezone
It shows the fst data that comes out from bing server.

( Sometimes those markers are too far away, There will be a problem that markers don't share a timezone, So I just make it simple. )

### The main part(map) contains 2 things:

marker and popup cmp which show when you click any marker

Markers shows and the map will auto fit itself after a req is finished.

The marker form self location is independent form the others, I think users may likely to search things around them, and they need to check their relative positions.

### The bottom left part contains a table cmp

It supports value filter, simgle delete, multiple delete
The change of tableData will influence markers on the map.

## PS
I have to say, It takes me some time finding tilelayers and map frames that works both in my country and 'The out 404 world'.
I don't want to waste my time finding and trying, so I just use some 'magic' to skip that process.
IT takes me 2 whole days to finish this, and I have to admit that vue-leaflet might not be the best choice, too limited.










