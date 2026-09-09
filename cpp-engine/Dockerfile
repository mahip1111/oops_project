# Multi-stage C++ Build
FROM alpine:3.19 AS builder

RUN apk add --no-cache \
    build-base \
    cmake \
    g++ \
    make

WORKDIR /app

COPY . .

RUN mkdir -p build && \
    cd build && \
    cmake .. && \
    make

# Lightweight Runtime
FROM alpine:3.19

RUN apk add --no-cache libstdc++

WORKDIR /app

COPY --from=builder /app/build/quickflow_engine /app/quickflow_engine

CMD ["/app/quickflow_engine"]
