# RabbitMQ and Kubernetes

The yml files in this directory are based on the RabbitMQ guide on deploying it to Kubernetes. You can find the
resources here:

* [Deploying RabbitMQ to Kubernetes: What’s Involved?](https://www.rabbitmq.com/blog/2020/08/10/deploying-rabbitmq-to-kubernetes-whats-involved/)
* [DIY RabbitMQ on Kubernetes](https://github.com/rabbitmq/diy-kubernetes-examples)

Make sure to read the guide above, which describes the process in details. Please note that simply applying these files
on your cluster *will not* result in a running RabbitMQ StatefulSet. In addition to these files, you will need to create
a secret for the Erlang cookie and another secret with the administrator credentials. For security reasons these are not
present in this repository, but the linked guide describes the process very well.
