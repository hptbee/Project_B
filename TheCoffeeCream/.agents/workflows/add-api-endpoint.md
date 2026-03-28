---
description: How to safely add a new API endpoint to the backend (TheCoffeeCream API)
---

# Adding a new API Endpoint Workflow

When requested to add a new endpoint or feature to the primary `.NET 8` backend, follow these precise steps:

## Prerequisites
1. Validate the exact JSON shape required by the mobile application requesting this endpoint.
2. Determine if it requires an authenticated `User` context (`BaseRequest` with Token vs Anonymous).

## Step 1: DTO definition
**Location**: `api/TheCoffeeCream/TheCoffeeCream.Application/DTOs/`
Create robust Request and Response Object implementations. Never map a pure entity back to the controller. Utilize standard nullable patterns if variables are optional.

## Step 2: Domain Abstraction & Infrastructure (Entity Framework Core)
**Location**: `api/TheCoffeeCream/TheCoffeeCream.Infrastructure/Repositories/`
1. If the entity is completely new, define it in `api/TheCoffeeCream/TheCoffeeCream.Domain/Entities/`.
2. Determine your interface in `TheCoffeeCream.Application/Interfaces/`.
3. For data mutation, strictly use **Entity Framework Core**. 
4. Write clean LINQ queries to be utilized by the specific `EfRepository`.

## Step 3: Application Service Definition
**Location**: `api/TheCoffeeCream/TheCoffeeCream.Application/Services/`
1. Build out the logic orchestrating your Database operations and Business Validation constraints.
2. Maintain standard exception bubbling.

## Step 4: Expose via the Controller
**Location**: `api/TheCoffeeCream/TheCoffeeCream/Controllers/`
1. Create or extend your controller.
2. Wrap the API response in the project standard Wrapper class (e.g. returning standard HTTP `200` with the `{ data, success, message }` JSON frame).
3. Secure the method via standard `[Authorize]` tags unless intended to be public.

## Step 5: Test Locally
Provide `cURL` commands to the user to test the endpoints instantly.
