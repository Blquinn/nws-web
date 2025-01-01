Download pmtiles cli https://docs.protomaps.com/pmtiles/cli

Download partial pmtiles from https://maps.protomaps.com/builds/ with command:

```sh
.\pmtiles.exe extract --maxzoom=6 https://build.protomaps.com/20241230.pmtiles ./tiles/20241230-z6.pmtiles
```

Serve that directory with webserver that can handle range requests 
like https://github.com/static-web-server/static-web-server

```sh
./static-web-server -p 8080 -d ./tiles -c *
```
