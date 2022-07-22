# Copyright (c) 2022 Nango, all rights reserved.

docker run -d --hostname nango-rabbit --name nango-rabbitmq -p 5672:5672 -p8082:15672 rabbitmq:3-management