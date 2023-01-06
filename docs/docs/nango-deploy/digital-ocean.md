# Deploy Nango to Digital Ocean (Droplet)

Deploy Nango on Digital Ocean in less than 5 minutes.

## Create a VM {#create-vm}

Go to [DigitalOcean](https://cloud.digitalocean.com/)  and click *CREATE > Droplets*. Create a default VM instance with options: 
- $20/month for testing, $40/month for production

On the [instance list page](https://cloud.digitalocean.com/droplets), note the *IP Address* address somewhere (referred below as INSTANCE_IP).

## Install Docker

Go to your Droplet instance page and click *Console*.

Install Docker & Docker Compose with the following commands:

```bash
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common wget
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add --
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian buster stable"
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
sudo usermod -a -G docker $USER
curl -s https://api.github.com/repos/docker/compose/releases/latest | grep browser_download_url  | grep docker-compose-linux-x86_64 | cut -d '"' -f 4 | wget -qi -
chmod +x docker-compose-linux-x86_64 && sudo mv docker-compose-linux-x86_64 /usr/local/bin/docker-compose
docker-compose --version
```

:::info
Refresh the VM console page to activate the new configuration.
:::

## Run Nango

Still in your VM’s console, install Nango by running: 

```bash
mkdir nango && cd nango
wget https://raw.githubusercontent.com/NangoHQ/nango/main/docker/aws/docker-compose.yaml && wget https://raw.githubusercontent.com/NangoHQ/nango/main/.env
docker-compose up -d # Nango is now running!
```

In your local computer’s console, create a Nango Sync by running (replace `INSTANCE_IP` if the value from the [Create a VM](#create-vm) section): 

```bash
curl --request POST \
    --url http://[INSTANCE_IP]/v1/syncs \
    --header "Content-type: application/json" \
    --data '{"url": "https://pokeapi.co/api/v2/pokemon", "response_path": "results", "paging_url_path":"next", "mapped_table":"pokemons", "frequency":"1 minute"}'
```

Back to your VM’s console, run: 

```bash
docker-compose logs -f
```

Console logs should show that jobs are running successfully (1st job should fetch 1000+ Pokémon, subsequent jobs should check that no new Pokémon was added).

:::info
This tutorial uses a local DB on the VM. Your should now connect Nango to your own database (cf. [docs](nango-sync/db-config#specifying-the-postgres-database)).
:::

## Update Nango

In your VM’s console, run:

```bash
docker-compose stop
docker-compose rm -f
docker-compose pull
docker-compose up -d
```