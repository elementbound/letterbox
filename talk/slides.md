---
marp: true
---

# Step Into Dockernetes

Gálffy Tamás

---

# Letterbox

Showtime!

---

# Irány a Docker

* Containers
* Images

---

# Containers

* Sarkítva miniatűr VM-ek
* Könnyű: osztott kernel
* Biztonságos: minden container izolálva van egymástól
* Mégsem VM: A VM-ek a hardvert virtualizálják, a container-ek az OS-t
* Egy dolga van, nem több

---

![bg contain](https://www.docker.com/sites/default/files/d8/2018-11/container-vm-whatcontainer_2.png)
![bg contain](https://www.docker.com/sites/default/files/d8/2018-11/docker-containerized-appliction-blue-border_2.png)

---

# Images

* Tartalmazza az OS-t
* Tartalmazza az alkalmazásunkat
* Rétegekből épül fel, minden réteg egy parancs
* A rétegek újrahasználhatók
* Központi tároló: [Dockerhub](https://hub.docker.com/)

---

![bg contain](https://docs.docker.com/storage/storagedriver/images/container-layers.jpg)

---

# Docker Compose demo

---

# Szünet

Kérdések? Válaszok?

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

* Node-ok összessége
* A cluster-rel dolgozunk amikor Kubernetes-ről van szó

---

# Nodes

* Virtuális vagy fizikai, de számítógép
* A master node-ok végzik az orchesztrálást
* A worker node-ok veszik fel és végzik el a munkát
* `kubectl get nodes`

---

# Pods

* A legkisebb munkaegység melyet kezelünk
* Egy vagy több container
* Leírás a containerek futtatásához
* Minden podnak saját IP címe van
* Tulajdonképpen a container megfelelője Kubernetes-ben

---

# Deployments

* Mi történik ha horizontálisan akarjuk skálázni az alkalmazásunkat?
  * => több pod-ot indítunk
* Hogy kezeljük ezeket a podokat?
  * => Deployments
* A deploymentek egybefogják a pod-okat és kezelik az életciklusukat
* Frissíteni akarjuk a podokat?
  * => frissítjük a deployment-et, Kubernetes pedig elintézi a pepecs munkát

---

# Services

* Hálózaton keresztül szeretnénk hivatkozni a pod-okra
* Probléma: A pod-ok nem állandóak, eltűnhetnek alattunk, létrejöhetnek újak
* Megoldás: Services
* A service-ek összefognak egy pod halmazt (is) és elérhetővé teszik egy adott címen

---

# Configmaps

* Probléma: Szeretnénk beállításokat kezelni, anélkül hogy beégetnénk azokat
* Megoldás: Configmaps
* A configmap egy Kubernetes resource ami kulcs-érték párokat tárol és hivatkozható

---

# Secrets

* Probléma: Jók ezek a configmap-ek, de nem szeretnénk ha könnyen elérhetőek lennének az értékek
* Megoldás: Secrets
* Kulcs-érték párok, titkosítva
* Limitáció: titkosított, de nem olvashatatlan

---

# Namespaces

* Probléma: Szeretnénk logikailag elkülöníteni a resource-ainkat ( pl. csapat, alkalmazás)
* Megoldás: Namespace
* Minden resource tartozik egy namespace-hez
* A két namespace közti kapcsolat limitált*, hogy ne legyenek ütközések

---

# Letterbox Cloud

Kezdjünk bele!

---

# Step Into Dockernetes

Gálffy Tamás

* Köszönöm a figyelmet!
* Kérdések? Válaszok?
* [Letterbox](https://github.com/elementbound/letterbox)
* Twitter: [@elementbound](https://twitter.com/elementbound)
* Email: ezittgtx@gmail.com
