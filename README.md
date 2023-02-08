## Installation

#### Docker

- [Install Docker](https://docs.docker.com/desktop/install/mac-install/)
- Enable Kubernetes in Docker > Preferences

#### Kubernetes Setup

- Create kubectl secrets

  - `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=` -- any string right now
  - `kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=` -- [from stripe developer dashboard](https://dashboard.stripe.com/test/developers)

- Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy) in `ticketing/` with `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.5.1/deploy/static/provider/cloud/deploy.yaml`
- Apply kubernetes in `ticketing/infra/k8s` with `kubectl apply -f .`
- Apply kubernetes in `ticketing/infra/k8s-dev` with `kubectl apply -f .`

#### Skaffold

- [Install skaffold](https://skaffold.dev/docs/install/)

#### Node Modules

- Install packages in all services (TODO: write a script to handle this)
  - `npm i`
    - /auth
    - /client
    - /expiration
    - /orders
    - /payments
    - /tickets

#### Enable forwarding of localhost

- update hosts file to forward localhost to ticketing.dev

  - `code /etc/hosts`
    - add `127.0.0.1 ticketing.dev` at end of file
  - save file as sudo user

#### Run locally

- `skaffold dev`
