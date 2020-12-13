# Letterbox

An MMO typing simulator to demonstrate working with Docker and Kubernetes.

Letterbox provides a 80x24 textbox where users can type and see others while they type, in real time.

A presentation was done featuring Letterbox as a sample application, see under [`talk/`](talk/).

## Features

* Persist history
* Calculate snapshots to avoid recalculating years of small changes
* Horizontally scalable, events are broadcast via RabbitMQ
* Realtime updates to clients via WebSockets
* Uses [Vanilla JS](http://vanilla-js.com/)

## Building

Letterbox uses Webpack to bundle its frontend code, which you can do by running:

```sh
npm run build
```

## Running

### Development

Letterbox requires MySQL and RabbitMQ to be running and configured. You can use .sh files under `scripts/` to start them
in Docker containers.

```sh
./scripts/start-docker-mysql.sh
./scripts/start-docker-rabbitmq.sh
```

> **Note:** The MySQL database needs to be setup before running the application. You can either do this manually by
> using the PHPMyAdmin interface started by the script and copy the contents of `scripts/database-setup.sql`, or change
> the shell script to use the `elementbound/letterbox-db` image.

Next, configure Letterbox based on the `.env.example` file.

Once you are done, you can run Letterbox:

```sh
npm run start:dev
```

As you edit the backend code, the application will restart. Editing frontend code will trigger Webpack to rebuild the
frontend bundle.

You can open Letterbox at <http://localhost:3000/>.

### Locally

If you want to just see the application running, you can use Docker Compose:

```sh
docker-compose up
```

This will launch the application and all of its dependencies and should be up and running in a matter of seconds. You
can open the application at <http://localhost:3000/>.

### In Kubernetes

Aside from secrets, all resource descriptors are stored under `kube/`.

First, you'll need to create the namespaces:

```sh
kubectl apply -f kube/letterbox-namespace.yml
kubectl apply -f kube/letterbox-mq-namespace.yml
```

Prepare the secrets needed for RabbitMQ, in the `letterbox-mq` namespace:

| Name             | Contents                                |
|------------------|-----------------------------------------|
| `erlang-cookie`  | `cookie=xleqtnracuavhilawxjecnttmtfanbrs` |
| `rabbitmq-admin` | `user=letterbox`                          |
|                  | `pass=vrlpvtrsefadeqof`                   |

Then create the RabbitMQ deployment:

```sh
kubectl apply -f kube/rabbitmq
```

Next, prepare the secrets for letterbox, in the `letterbox` namespace:

| Name                  | Contents                                                                                    |
|-----------------------|---------------------------------------------------------------------------------------------|
| `letterbox-db-root`   | `MYSQL_ROOT_PASSWORD=gcnfwtsstnpmhfwb`                                                      |
|                       | `DATABASE_PASSWORD=gcnfwtsstnpmhfwb`                                                        |
|                       | `DATABASE_USER=root`                                                                        |
| `letterbox-mq-secret` | `url=amqp://letterbox:vrlpvtrsefadeqof@rabbitmq-client.letterbox-mq.svc.cluster.local:5672` |

Once done, create letterbox in the cluster:

```sh
kubectl apply -f kube
```

Once done, you should have a fully functioning letterbox deployment behind a loadbalancer. Use the loadbalancer's
external IP to access your very own letterbox.

## License

Unless otherwise noted, the contents of this repository are under the MIT license.

See [LICENSE](LICENSE).
