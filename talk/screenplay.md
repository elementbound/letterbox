# Step Into Dockernetes

* Intro chat - 19:05
* Docker & Compose - 19:45; 40 min
  * Docker; 20min
    * Start application; 2m
      * Application won't start
      * Do we go and download, install and configure all our stuff?
      * Docker to the rescue
    * Start MySQL and RabbitMQ with scripts; 2m
      * Make sure to show the scripts beforehand!
    * Provide theoretical background; 8m
      * Lightweight containers
      * Images
      * Docker Hub
      * Look at scripts again to summarize
    * Start app; 3m
      * Open PHPMyAdmin, try to connect
      * Explain why localhost won't work for host
      * Use ifconfig ip
      * Paste query
    * Dockerize DB - screw the query, let's automate!; 4m
      * Objective: create an image *exactly* the same as `mysql` but execute a script on startup
      * The `mysql` image picks up all SQL's from a given directory
      * The rest can be copied
      * MySQL on Docker: <https://hub.docker.com/_/mysql>
      * Explain FROM and mention FROM scratch
    * Dockerize app; 4m
      * Explain step by step
  * Docker Compose; 10min
    * Goal: how about we automate the whole stack thing
    * Dockerize as-is
    * Dockerize with scaling
* Kubernetes - 20:25; 25min
  * Goal: Yay, we have an app locally, let's get this going in the cloud
  * Start with theory; 8min?
    * Kubernetes cluster
    * Nodes
    * Pods
    * Deployments
    * Services
    * Configmaps
    * Secrets
    * Namespaces
  * Push docker images; 2min
  * Deploy stuff; 15min
    * Deploy RabbitMQ - create NS and `kubectl apply -f`; 2m
      * Create secrets `erlang-cookie` and `rabbitmq-admin`
      * All is explained in the docs
    * Deploy MySQL; 3m
      * Create `letterbox-db-root` secret
      * Simply create the deployment
      * Create the service
    * Deploy Letterbox; 7m
      * Create `letterbox-config` configmap
      * Create `letterbox-mq-secret` secret
      * Create letterbox deployment
    * Put that shit on the internet; 3m
      * Create letterbox loadbalancer
    * Pre-baked URL: <http://a51788ab58ca440f5b08cfbf82527dbf-318075304.eu-central-1.elb.amazonaws.com/>
