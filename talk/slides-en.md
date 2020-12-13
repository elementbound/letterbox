---
marp: true
---

# Step Into Dockernetes

Gálffy Tamás

---

# Letterbox

Showtime!

---

# Enter Docker

* Containers
* Images

---

# Containers

* Basically miniature VM's
* Lightweight: shared kernel
* Safe: containers are isolated from eachother
* Not exactly VM's: VM's virtualize hardware, while containers virtualize the OS
* Does a single thing, not more

---

![bg contain](https://www.docker.com/sites/default/files/d8/2018-11/container-vm-whatcontainer_2.png)
![bg contain](https://www.docker.com/sites/default/files/d8/2018-11/docker-containerized-appliction-blue-border_2.png)

---

# Images

* Contain the OS
* Contain our application
* Composed of layers, each layer is an instruction
* Layers are reusable
* Central repository: [Dockerhub](https://hub.docker.com/)

---

![bg contain](https://docs.docker.com/storage/storagedriver/images/container-layers.jpg)

---

# Docker Compose demo

---

# Break

Questions? Answers?

---

# Kubernetes

* Cluster
* Nodes
* Pods
* Deployments
* Services
* Configmaps
* Secrets
* Namespaces

---

# Cluster

* A set of nodes
* Interact with the cluster when working with Kubernetes

---

# Nodes

* Virtual or physical, but machines
* Master nodes do the orchestration
* Worker nodes carry out the actual work
* `kubectl get nodes`

---

# Pods

* The smallest unit of work managed
* One or more containers
* Description for running the containers
* Each pod gets its own IP address
* Basically the Kubernetes equivalent of Docker's containers

---

# Deployments

* What happens if we want to horizontally scale our app?
  * => launch more pods
* How do we manage these pods?
  * => Deployments
* Deployments collect and manage the pods and their lifecycles
* Want to update the pods?
  * => update the deployment, Kubernetes handles all the tedious work

---

# Services

* We'd like to refer to pods through the network
* Problem: Pods are ephemeral, some might vanish, new ones might be created
* Solution: Services
* Services clump together a set of pods and make them accessible under a given address

---

# Configmaps

* Problem: We'd like to configure our pods without hardcoding the values
* Solution: Configmaps
* Configmaps are Kubernetes resources that store key-value pairs and can be referred to

---

# Secrets

* Problem: Configmaps are well and good, but we don't want the values to be easily accessible
* Solution: Secrets
* Key-value pairs, encrypted
* Limitation: Encrypted, but not unreadable

---

# Namespaces

* Problem: We'd like to logically separate our resources ( e.g. by team, by app )
* Solution: Namespace
* Each resource belongs to a namespace
* Connection between two namespaces is limited* to avoid name clashes

---

# Letterbox Cloud

Let's start!

---

# Step Into Dockernetes

Gálffy Tamás

* Thank you for your attention!
* Questions? Answers?
* [Letterbox](https://github.com/elementbound/letterbox)
* Twitter: [@elementbound](https://twitter.com/elementbound)
* Email: ezittgtx@gmail.com
