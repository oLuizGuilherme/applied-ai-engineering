# API Calls

Start the API before running these examples:

```sh
npm run dev
```

The server listens at `http://localhost:3000`.

## Create a task

```sh
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write tests"}'
```

## List tasks

List all tasks:

```sh
curl -i "http://localhost:3000/tasks"
```

List open tasks:

```sh
curl -i "http://localhost:3000/tasks?filter=open"
```

List done tasks:

```sh
curl -i "http://localhost:3000/tasks?filter=done"
```

## Conclude a task

```sh
curl -i -X PATCH \
  "http://localhost:3000/tasks/Write%20tests/conclude"
```

Titles are matched without regard to case. Use URL encoding for spaces and other URL characters.

## Remove a task

```sh
curl -i -X DELETE \
  "http://localhost:3000/tasks/Write%20tests"
```

## Example sequence

```sh
# Create two tasks
curl -sS -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Write tests"}'

curl -sS -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Review implementation"}'

# List open tasks
curl -sS "http://localhost:3000/tasks?filter=open"

# Conclude one task using different casing
curl -sS -X PATCH \
  "http://localhost:3000/tasks/write%20tests/conclude"

# List all tasks and done tasks
curl -sS "http://localhost:3000/tasks"
curl -sS "http://localhost:3000/tasks?filter=done"

# Remove one task
curl -sS -X DELETE \
  "http://localhost:3000/tasks/Review%20implementation"

# List remaining tasks
curl -sS "http://localhost:3000/tasks"
```

## Error examples

Blank title:

```sh
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"   "}'
```

Duplicate title:

```sh
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"write TESTS"}'
```

Invalid filter:

```sh
curl -i "http://localhost:3000/tasks?filter=pending"
```

Missing task:

```sh
curl -i -X PATCH \
  "http://localhost:3000/tasks/Missing%20task/conclude"

curl -i -X DELETE \
  "http://localhost:3000/tasks/Missing%20task"
```

Malformed JSON:

```sh
curl -i -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{'
```
