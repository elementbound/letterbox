# Step into Dockernetes addendum

* [Step into Dockernetes addendum](#step-into-dockernetes-addendum)
  * [Docker](#docker)
    * [Networking in Docker](#networking-in-docker)
      * [Connecting to dockerhost](#connecting-to-dockerhost)
    * [Building in the image](#building-in-the-image)
    * [Creating a custom MySQL image](#creating-a-custom-mysql-image)
    * [Build context and dockerignore](#build-context-and-dockerignore)
    * [RUN vs CMD vs ENTRYPOINT](#run-vs-cmd-vs-entrypoint)
  * [Kubernetes](#kubernetes)
    * [Getting your own cluster to play with](#getting-your-own-cluster-to-play-with)
      * [Locally](#locally)
      * [Cloud](#cloud)
        * [Caveats](#caveats)
    * [What went wrong with the application](#what-went-wrong-with-the-application)
  * [Credits](#credits)

## Docker

### Networking in Docker

This is a *very* extensive topic and could have had its own two-hour or longer presentation, so we've only barely
scratched the surface in this session.

#### Connecting to dockerhost

In the presentation I've mentioned that in order to connect to a given port on the machine *hosting* the docker
instances, we can't use `localhost` since that resolves to the container itself and not the docker host. To solve that,
the dockerhost's IP was used.

However, you can also use the `host.docker.internal`. As of writing, this works on Macs and Windows, but not on Linux,
although it is in progress.

On the other hand, you can use the `--network="host"` switch with `docker run`, which will make `127.0.0.1` in the
container resolve to the docker host. This only works on Linux.

See:

* [From inside of a Docker container, how do I connect to the localhost of the machine? on
  StackOverflow](https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach)
* [I want to connect from a container to a service on the host - on
  Windows](https://docs.docker.com/docker-for-windows/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)
* [I want to connect from a container to a service on the host - on
  Mac](https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)

### Building in the image

We've discussed briefly whether it's better to build the application inside the container or build it outside and then
copy the result in.

My answer mainly revolved around building *inside* the container, so that the build environment is always exactly the
same.

This answer works well for node.js projects, since there's not much to build generally, all you need to do is to install
dependencies and potentially do some preprocessing, like running webpack in the case of letterbox.

However, this is not necessarily the case for all node.js / Javascript / TypeScript based apps, and definitely not the
case for *all* applications regardless of technology.

Take Java for example. If we wanted to build and run the application from the same image, we would have to first install
Maven ( or Gradle ), run the build, which includes downloading dependencies, running static code analysis, and running
all tests. This process results in left-over files ( the `.m2` directory full of downloaded but no longer needed
dependencies for Maven ) that also need to be cleaned up.

Still, it would make a lot of sense to have a constant, unchanging build environment. If we stay strictly with Docker, a
solution could be to have one image for building the application, then putting the artifact in another, application
image.

So, unfortunately the best answer I have at the moment is 'it depends'. Should you build your app in Docker? Should you
build it in the same image that will run the app afterwards?

It depends.

See (semi-relevant but still useful):

* [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

### Creating a custom MySQL image

When creating the `letterbox-db` image, I've copied the last few lines of the official MySQL image's Dockerfile, which
contained an entrypoint, a cmd and an expose command.

While EXPOSE is purely documentation, the ENTRYPOINT and CMD commands were also unnecessary, as they are inherited from
the base image.

Dockerfiles can have multiple ENTRYPOINTs, but only the last one will be used. So in our case, we've overridden the
original entrypoint with the exact same settings, making no difference.

Similar is the case with CMD - if more of them are present, only the last one will be used. So we've, once again,
overridden a setting with the exact same one.

See:

* [EXPOSE](https://docs.docker.com/engine/reference/builder/#expose)
* [ENTRYPOINT](https://docs.docker.com/engine/reference/builder/#entrypoint)
* [CMD](https://docs.docker.com/engine/reference/builder/#cmd)

### Build context and dockerignore

When building an image with a given path ( i.e. we point it to a directory ), the whole directory's contents are
packaged and sent to the Docker daemon. Note that this daemon could be running anywhere, so this *build context* needs
to be sent over.

This is where you might run into issues where your directory contains loads of data that are not needed for the build
but happen to be in the same directory as your Dockerfile. One example where I have encountered this is having an
application with a MySQL database mounted in the same directory as its source. Of course this directory was ignored by
git, but since I did not have a `.dockerignore` file, all of that data was sent over to the daemon and subsequently
ignored by the build.

So while you don't necessarily encounter this often, once you do, it is very useful to know about `.dockerignore`.

See:

* [Build with PATH](https://docs.docker.com/engine/reference/commandline/build/#build-with-path)

### RUN vs CMD vs ENTRYPOINT

RUN is executed during build, and can be used to setup your environment. For example you can install packages, execute
scripts, or in our case, install dependencies and do a security audit to make sure we aren't using any shady
dependencies.

CMD allows to set the default command, which will be executed if the image is ran without a command. This can be
overridden when launching with `docker run`.

On the other hand, ENTRYPOINT and its parameters will not be ignored.

I'm purposefully brief here, since this has been explained way better and in more details than I can, by others :)

See:

* [Docker RUN vs CMD vs ENTRYPOINT](https://goinbigdata.com/docker-run-vs-cmd-vs-entrypoint/)
* [Difference between RUN and CMD in a Dockerfile on
  StackOverflow](https://stackoverflow.com/questions/37461868/difference-between-run-and-cmd-in-a-dockerfile)

## Kubernetes

### Getting your own cluster to play with

#### Locally

One of your options would be to run a Kubernetes cluster locally, on your machine, just to toy around a bit. In these
cases, you can install:

* [minikube](https://minikube.sigs.k8s.io/docs/)
* [microk8s](https://microk8s.io/tutorials)

Important to mention, that as of writing, minikube does not support LoadBalancer services, but can be worked around with
manually specifying the service's external IP as your own host's IP (
[see](https://stackoverflow.com/questions/55462654/cant-access-minikube-loadbalancer-service-from-host-machine) ).

Personally I do not have much experience with microk8s, but wanted to mention alternatives. Looking up load balancers,
it does seem to have an addon for that: [Add on: MetalLB](https://microk8s.io/docs/addon-metallb)

#### Cloud

You can also get your own cluster running in the cloud. Major cloud providers have their own solutions for provisioning
Kubernetes clusters:

* AWS Elastic Kubernetes Service
* AWS Fargate
* Azure Kubernetes
* Google Kubernetes Engine

For the presentation, I have tried AWS Fargate but ended up using managed nodes with AWS EKS. These are well-documented
and have easy to follow guides on how to get started.

##### Caveats

* While both managed nodes and AWS Fargate have their use cases, Fargate does not fully support loadbalancers, hence I
  ended up using AWS EKS.
* AWS Fargate does not pick up all resources in all namespaces by default, you have to create Fargate profiles for them.

### What went wrong with the application

At the end of the presentation, I have deployed the load balancer, copied its external IP to the browser aaaand...
nothing happened.

Thankfully I've had another cluster with the application running as intended, so I've just switched to the load balancer
there and demod the application with that. Still, you might be keen on knowing why didn't it work with the presentation
cluster.

1. Run `kubectl describe svc letterbox-loadbalancer`
   1. All the events seemed to be fine actually, so the loadbalancer is okay
2. Run `kubectl get po`
   1. All of the letterbox pods were down
3. Pick a pod and describe it with `kubectl describe po letterbox-....-....`
   1. Check the events
   2. It couldn't read the configmap specified
4. **Verdict:** I've mistyped the configmap name when creating it 🤦
5. **Solution:** Change the configmap name in the yml file and `kubectl apply -f` it

## Credits

The extra Docker notes were brought up by Peter. Thank you!

Feel free to check his blog at <https://psprog.hu/>
