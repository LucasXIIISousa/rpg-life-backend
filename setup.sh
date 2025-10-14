#!/bin/bash
docker exec -i postgres_db psql -U admin -d rpg_database < database/scripts/create_tables.sql