---
title: Kendi sunucunuzda barındırma rehberi
description: Expense Budget Tracker'ı Docker Compose ve Postgres ile kendi sunucunuzda çalıştırın.
---

## Gereksinimler

- Docker ve Docker Compose
- Postgres 18 (Compose dosyasına dahil)

## Hızlı başlangıç

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Bu komutlar Postgres'i başlatır, veritabanı geçişlerini uygular ve şu bileşenleri çalıştırır.

- `http://localhost:3000` adresindeki web uygulaması
- `http://localhost:8081` adresindeki kimlik doğrulama hizmeti
- Docker Compose ile çalışan ve döviz kurlarını alan arka plan süreci

## Yapılandırma

`.env.example` dosyasını `.env` adıyla kopyalayın ve şu ayarları düzenleyin.

- `MIGRATION_DATABASE_URL` – Veritabanı geçişlerini uygulayan veritabanı sahibi rolü
- `DATABASE_URL` – Web uygulamasının kullandığı veritabanı rolü
- `AUTH_DATABASE_URL` – Kimlik doğrulama hizmetinin kullandığı şema rolü
- `AUTH_MODE` – Yerel kullanım için `none`, e-postadaki tek kullanımlık kodla oturum açılan ortamlar için `cognito`
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` ve `ALLOWED_REDIRECT_URIS` – Kimlik doğrulama yönlendirmeleri ve çerezler

`AUTH_MODE=cognito` olduğunda `.env.example` dosyasındaki Cognito ayarları ve `SESSION_ENCRYPTION_KEY` de gerekir.

## Güncelleme

```bash
git pull
make up
```

Docker Compose, hizmetleri yeniden oluşturur ve `migrate` kapsayıcısıyla veritabanı geçişlerini tekrar çalıştırır.

## AWS Dağıtımı

Üretimdeki CDK yığını ECS Fargate, RDS, ALB, Cognito, API Gateway ve Lambda kullanır. Uygulamanın herkese açık adresleri aşağıdadır.

- `app.<domain>` – ALB arkasında ECS Fargate üzerinde çalışan web uygulaması
- `auth.<domain>` – ALB arkasındaki OTP ve OAuth hizmeti
- `api.<domain>/v1/*` – API Gateway ve Lambda üzerinden programatik SQL REST API'si
- `mcp.<domain>/mcp` – Ayrı bir API Gateway HTTP API'si ve MCP Lambda işlevi üzerinden barındırılan MCP hizmeti

Özel MCP alan adı için tam olarak `mcp.<domain>` adına düzenlenmiş, herkese açık bir ACM sertifikası gerekir. Yenileme için DNS doğrulama CNAME kaydını koruyun, sertifikanın ARN değerini CDK dağıtımına ve CI'a sağlayın ve diğer herkese açık alan adlarının yanında `mcp.*` DNS kaydını oluşturun.

Desteklenen kurulum sırası ve betikler için depodaki [dağıtım özeti](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) ve [AWS CDK rehberi](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) (ikisi de İngilizce) bakın.
