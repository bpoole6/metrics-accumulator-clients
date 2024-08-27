<h1 align="center" style="border-bottom: none">
   <img alt="Metrics Accumulator" src="https://apoole-personal-bucket.s3.amazonaws.com/images_used_by_links/github/Logo+for+metrics+Accumulator.svg" width="600"><br>Metrics Accumulator
</h1>


# metrics-accumulator-client
This is the official NodeJs client for [metric accumulator](https://github.com/bpoole6/metrics-accumulator). 


## Get Started

Start an instance of metric-accumulator

```bash
docker run \ 
 -p 8080:8080 \ 
 bpoole6/metrics-accumulator
```

Create main.js file
```node
import {Registry, Counter} from "prom-client"

const registry = new Registry()
new Counter({
    name : "counter_example_total",
    help: "help",
    registers: [registry]
})

let client = new Client("http://localhost:8080", "0d98f65f-074b-4d56-b834-576e15a3bfa5")
client.updateMetrics('default', registry).then(res=> console.log(res.statusCode + " " + res.content))
client.getMetricGroup('default').then(res=> console.log(res.statusCode + " " + res.content))
client.reloadConfigurations().then(res=> console.log(res.statusCode + " " + res.content))
client.resetMetricGroup("default").then(res=> console.log(res.statusCode + " " + res.content))
client.serviceDiscovery().then(res=> console.log(res.statusCode + " " + res.content))
client.currentConfigurations().then(res=> console.log(res.statusCode + " " + res.content))
```

Please see [metric accumulator](https://github.com/bpoole6/metrics-accumulator) for official documentation.