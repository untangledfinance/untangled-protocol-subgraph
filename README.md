# The Graph subgraphs related to the UnTangled Protocol (Under Construction, DO NOT USE YET)

## Usage

### Schema

The schema is defined under: [schema.graphql](./schema.graphql)

### Debugging

Debugging on the graph should be done through logs and checking the subgraph logs:

- [Logging and Debugging](https://thegraph.com/docs/developer/assemblyscript-api#logging-and-debugging)

In practical terms, logs should be added to monitor the progress of the application.

### Validating data received from the subgraph

1. Change the network to be mainnet
2. Change on App.tsx the currentBlock. eg:

```
- const currentBlock = getBlockInfo(await getCurrentBlock())
+ const currentBlock = {
+   number: 13845148,
+   timestamp: 1637262806,
+ }
```

- Add the block number on the graphql/queries.ts. eg:

```
_meta(block: {number: 13845148}) {
  ...
}
seniorPools(first: 1, block: {number: 13845148}) {
  ...
}
tranchedPools(block: {number: 13845148}) {
  ...
}
```

- On `usePoolsData`, disable the skip flag from web3 and add the validation scripts

```
  // Fetch data from subgraph
  const {error, backers: backersSubgraph, seniorPoolStatus, data} = useTranchedPoolSubgraphData(..., false)

  // Fetch data from web3 provider
  const {backers: backersWeb3, poolsAddresses} = usePoolBackersWeb3({skip: false})
  const {seniorPoolStatus: seniorPoolStatusWeb3} = useSeniorPoolStatusWeb3(capitalProvider)

  if (backersSubgraph.loaded && backersWeb3.loaded && currentBlock && untangledProtocol) {
    generalTranchedPoolsValidationByBackers(backersWeb3.value, backersSubgraph.value)
    generalBackerValidation(untangledProtocol, data, currentBlock)
  }
```

- Beaware that running `generalBackerValidation` will run the validations for all backers which is subject to rate limit of the web3 provider
- On `src/graphql/client.ts` change the `API_URLS` for the url of the subgraph you want to validate

### Tests

Subgraph tests use [Matchstick](https://github.com/LimeChain/matchstick) as a unit testing framework which is still in the early stages of development.

```
docker build -t matchstick . && docker run --rm matchstick
```

or

```
graph test
```

- [Unit Testing Framework](https://thegraph.com/docs/en/developer/matchstick/)
- [Demo Subgraph (The Graph) showcasing unit testing with Matchstick](https://github.com/LimeChain/demo-subgraph)
- [aavegotchi-matic-subgraph tests](https://github.com/aavegotchi/aavegotchi-matic-subgraph/tree/main/src/tests)

## Deployment

### Local

Typically we'd deploy the subgraph locally for a few reasons:

1. Adding logic that writes to the blockchain
2. Adding subgraph indexers
3. Having access to the latest smart contract logic.

It's a crucial step!

#### Mac OS X

**With Docker**

Docker is a virtual machine platform that can be used to package up all of the other services that a Graph Node depends on and run them together. It offers a big advantage in terms of convenience, but time has shown that when it comes to running Graph Node, it's rather brittle and tends to crash often, which leads to Docker itself hanging and becoming unresponsive. This forces you to restart your whole machine and start over, which is a major annoyance. Please refer to the "Without Docker" section below to proceed without needing to deal with this.

- Make sure you have docker and docker-compose installed
- Start the local chain with `yarn start` in the `protocol` directory. This should run _without_ mainnet forking (it takes way too long to index with mainnet forking)
- In another terminal, go to the `subgraph` directory and run `yarn start-local`. This will start up 3 Docker containers that The Graph needs. One for Postgres, one for IPFS, one for Graph Node (which is the actual The Graph product)
- Give it a minute or so to start up, then run `yarn create-local`. This will create an instance of the UnTangled subgraph (same as if you had created a new empty subgraph on the hosted service)
- Now run `yarn deploy-local`. This will generate a local `subgraph-local.yaml` file, and edit some constants in the source code, then it will deploy into the Docker containers.
- The indexing of the subgraph should start immediately.
- Urls available are:
  - JSON-RPC admin server at: http://localhost:8020
  - GraphQL HTTP server at: http://localhost:8000
  - Index node server at: http://localhost:8030
  - Metrics server at: http://localhost:8040

**Without Docker - Optimization (optional)**

Below are some steps to create and deploy the subgraph **without** needing to set up Docker first.

_Installation_

- Clone the [graph-node codebase](https://github.com/graphprotocol/graph-node). Note that the instructions for pre-installation on the ReadMe are similar to what's found below.
- Install [Rust](https://www.rust-lang.org/tools/install)  
  NOTE: In order to ensure the Rust compiler has installed correctly, you can use the command `rustc --version`
- Install [Postgres](https://wiki.postgresql.org/wiki/Homebrew). Installing through homebrew is pretty convenient on mac. To connect/use it as your user, you can type in: `psql postgres`
- Install [IPFS](https://docs.ipfs.tech/install/command-line/#install-official-binary-distributions)
- Install [Protobuf](https://grpc.io/docs/protoc-installation/)

After the installation process, you'd need to go through a few steps to create and deploy the subgraph.

_Development_

- Enter into the `graph-node` directory. Build the binary for the Graph Node before you run it for the first time, with `cargo build`.
- On a new terminal window, start running `ipfs daemon`. Note: We'd recommend opening a split terminal, where you can run `ipfs` on one side, and the `graph-node` server on the other.
  Pro-tip: if you run into an issue with the port not connecting to `localhost:5001`, you can change the config of `ipfs` to listen in on a different
  port with the following command: `ipfs config Addresses.Gateway /ip4/0.0.0.0/tcp/5002` for example.
- Before starting the `graph_node` server, you would need to re-create the `graph_node` database by running the following commands:

```postgres
$psql postgres
postgres=# drop database "graph-node"; create database "graph-node";
```

The reason being that when we run the chain locally, we start running hardhat, which provides test data. The smart contract will emit events that the `graph-node` database stores during that server session. That data becomes irrelevant however, in the next session we run the server. That's why in order to keep the database uncorrupted with stale data, we'd need to re-create it.

- Run the local chain from the root directory `mono/` with `yarn-start local` so that it can start up `hardhat` and other software packages.
- Proceed with running the `graph-node` server using the following command template within the `graph-node` directory:

```bash
cargo run -p graph-node --release -- --postgres-url postgresql://user:pass@localhost:5432/graph-node --ethereum-rpc localhost:http://localhost:8545 --ipfs 127.0.0.1:5002
```

Below are the following descriptions for each component of the above command:

```
--postgres-url postgresql://user:pass@localhost:5432/graph-node is a connection string for a postgresDB running on the local machine. user/pass will vary depending on your system. usually your OS username will suffice. graph-node is the name of an empty database that we created
--ethereum-rpc localhost:http://localhost:8545 indicates that we want Graph Node to read from the RPC for hardhat, and we're giving this network the codename "localhost" (instead of "mainnet")
--ipfs http://localhost:5002 this is the API server for IPFS, port may vary depending on your config
```

- The rest of the steps are similar to what's above (steps 4 through 6):
  - run `yarn create-local` - creates the subgraph instance titled: `untangled-subgraph`
  - run `yarn deploy-local` - deploys the subgraph to `localhost:8000`

#### Linux

- Run: `./reset-local.sh && ./start-local.sh` or `./start-local.sh`
  - If you are on linux, the Graph Node Docker Compose setup uses host.docker.internal as the alias for the host machine. On Linux, this is not supported yet. The detault script already replaces the host name with the host IP address. If you have issues, run `ifconfig -a` and get the address of the docker0

#### Cleaning up after running locally

- Run `docker compose down -v` to tear down the Docker instances
- Run `rm -rf ./data` from `subgraph` to remove any leftover data from execution. If you forget this step, it can lead to errors on subsequent runs.
- Don't forget to close your locally-running blockchain from `protocol`

#### Quick Runs

- A quick run script is available: `subgraph/quick-start.sh`. This requires a test dump to be restored to the postgres container.
  - This only works for mainnet forking
  - The network on metamask should be http://localhost:8545

#### Creating local backups

- If you already have a running db and want to save it for future runs use:
  - docker exec -t <postgres-container-id> pg_dumpall -c -U graph-node > ~/dump.sql

### Production

For deploying the production subgraph:

```
cd subgraph
yarn graph auth --product hosted-service <deploykey>
yarn graph codegen
yarn graph build
yarn graph deploy --product hosted-service xxxx
```

## Additional Resources

- [The Graph Academy](https://thegraph.academy/developers/)
- [The Graph Academy Hub](https://github.com/TheGraphAcademy/Graph-Academy-Hub)
- [The Graph Explorer](https://thegraph.com/explorer/)
- [Subgraph Monitor](https://github.com/gnosis/thegraph-subgraphs-monitor)
- [Subgraph Toolkit](https://github.com/protofire/subgraph-toolkit)
- [Create Subgraph](https://thegraph.com/docs/developer/create-subgraph-hosted)
