# kylelucas.io
A Jekyll based personal site and blog using various modern web technologies.

![kylelucas.io screenshot](http://i.imgur.com/oGcRC6p.png)

## Usage
### Hot Reload Server
```jekyll serve```
### Build
#### Development
```jekyll build```
#### Production
```JEKYLL_ENV=production jekyll build```
### Deploy
```s3_website push --config-dir ./config```

NOTE: This repository does not mirror the config.yml or the config/s3_website.yml and may have toubles running without them.
