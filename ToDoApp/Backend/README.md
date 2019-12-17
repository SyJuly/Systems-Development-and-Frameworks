# Backend


1. Update packages
-       npm install
2. Download [Neo4j Desktop](https://neo4j.com/download/neo4j-desktop/?edition=desktop&flavour=unix&release=1.2.3&offline=true)
3. Create database (*TodoApp*) with password (*password*)
4. Start database, view Neo4j web interface on:

    - bolt://localhost:7687
    - http://localhost:7474
    - https://localhost:7473
    
5. Start backend

        \\Start with seed
        node index.js --seed
        
        \\Start without seed
        node index.js

6. Write queries from GraphQL web interface (http://localhost:4000/)

## Tips

##### View whole graph in Neo4j web interface
        MATCH (n)
        RETURN n

##### Clear database from everything
        MATCH (n)
        DETACH DELETE n