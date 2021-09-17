# Local Cosmos DB on macOS

### Prerequisites

Install [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) for Mac

### Get the IP address of your machine

```
ipaddress="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
```

### Pull the Docker image

```
docker pull mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
```

### Run the Docker container for the first time

Please replace `{container-name}` before executing.

```
docker run -p 8081:8081 -p 10251:10251 -p 10252:10252 -p 10253:10253 -p 10254:10254 -m 3g --cpus=2.0 --name={container-name} -e AZURE_COSMOS_EMULATOR_PARTITION_COUNT=2 -e AZURE_COSMOS_EMULATOR_ENABLE_DATA_PERSISTENCE=true -e AZURE_COSMOS_EMULATOR_IP_ADDRESS_OVERRIDE="$ipaddress" -d mcr.microsoft.com/cosmosdb/linux/azure-cosmos-emulator
```

### Install the self signed certificate

The emulator is running. Use another terminal window and load your IP address into a variable.

```
ipaddress="`ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk '{print $2}' | head -n 1`"
```

### Download the certificate for the emulator

```
curl -k https://$ipaddress:8081/_explorer/emulator.pem > emulatorcert.crt
```

### Add the certificate to the Keychain

1. Open the Keychain Access app.
2. Select **File** and **Import Items** and import the _emulatorcert.crt_.
3. After the _emulatorcert.crt_ is loaded into Keychain, double-click on the **localhost** name and change the trust settings to **Always Trust**.

### Set runtime configuration

This is necessary so that the [CosmosClient](https://www.npmjs.com/package/@azure/cosmos) knows the path of the certificate.

Open the `.zshrc` file and add the following line:

```
export NODE_EXTRA_CA_CERTS=[PATH_TO_YOUR_CERTIFICATE]
```

### Browse and manage your data

```
https://localhost:8081/_explorer/index.html
```

### Local Development

##### Run

```bash
# development
$ npm run start
```

##### Configure

In order to run this project locally, you need to add the `.env` file and set the following values:

- `DATABASE` - The name of the database.
- `ENDPOINT` - The URL of the endpoint (e.g. `https://localhost:8081`).
- `KEY` - The secret key to access the database.
