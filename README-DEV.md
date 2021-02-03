## Development environment

### Step 1: Configure WebStorm

Setting up the React syntax environment

Preferences > Languages & Frameworks > JavaScript > [select React JSX]

Configuring eslint rules and plug-ins

Link:http://gitlab.omcoin-inc.com/omfe/eslint


### Step 2: run the app

Switch npm warehouse address to company private warehouse (nrm tool is recommended）
```shell
sudo npm i nrm -g
nrm add omex http://npm.omcoin-inc.com:7001
nrm use omex
```

Installing dependent libraries：

```shell
npm install
```

Then run the application：

```shell
npm run dev
```

Access the app：
http://127.0.0.1:5200/dex-test


### nginx.conf configuration
Involving cross-domain, need to be resolved through Nginx proxy.
`vi /usr/local/etc/nginx/servers/omchain.conf`

```shell
upstream getsvr {
server 192.168.13.125:20159; # backend node IP
}

server {
	listen 7777;
	location / {
		# Need to set the address of the front-end deployment
		add_header Access-Control-Allow-Origin '*';
		add_header Access-Control-Allow-Methods 'POST, GET, OPTIONS';
		add_header Access-Control-Allow-Headers 'X-Requested-With,Content-Type,origin, content-type, accept, authorization,Action, Module, access-control-allow-origin,app-type,timeout,devid';
		add_header Access-Control-Allow-Credentials true;
		if ($request_method = 'OPTIONS') {
			return 204;
		}
		proxy_pass http://getsvr;
	}
}
```

### Back-end data access instructions

In src/constants / config.configure api address in js

```shell
omchain: {
	browserUrl: '${omchainExplorerBaseUrl} / explorer / omchain'` / / browser address
	searchrUrL: '${omchainExplorerBaseUrl} / explorer / omchain` search', / / Search address
	clientUrl: 'http://127.0.0.1:7777', / / nginx address
},
```
Among them，
omchainExplorerBaseUrl is the browser address.Since the project is not open source, block browser is not available for the time being.
clientUrl is the back-end interface address