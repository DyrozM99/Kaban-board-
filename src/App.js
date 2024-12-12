// App.js
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Container, AppBar, Toolbar, Typography, Card, CardContent, Button, Box, Grid } from "@mui/material";
import TaskIcon from "@mui/icons-material/Task";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const initialData = {
  tasks: {
    "task-1": { id: "task-1", content: "Tarea 1" },
    "task-2": { id: "task-2", content: "Tarea 2" },
    "task-3": { id: "task-3", content: "Tarea 3" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Por Hacer",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "En Progreso",
      taskIds: ["task-3"],
    },
    "column-3": {
      id: "column-3",
      title: "Completado",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

const App = () => {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setData((prevData) => ({
        ...prevData,
        columns: {
          ...prevData.columns,
          [newColumn.id]: newColumn,
        },
      }));
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    setData((prevData) => ({
      ...prevData,
      columns: {
        ...prevData.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    }));
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static" sx={{ mb: 4, bgcolor: "#3f51b5" }}>
        <Toolbar>
          <TaskIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Tablero de Tareas
          </Typography>
          <Button color="inherit" startIcon={<AddCircleIcon />}>
            Nueva Tarea
          </Button>
        </Toolbar>
      </AppBar>
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Grid item xs={4} key={column.id}>
                <Box sx={{ bgcolor: "#e0f7fa", p: 2, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
                    {column.title}
                  </Typography>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: 200,
                          bgcolor: "#ffffff",
                          p: 2,
                          borderRadius: 2,
                          boxShadow: 2,
                        }}
                      >
                        {tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 2,
                                  bgcolor: "#f5f5f5",
                                  boxShadow: 1,
                                  "&:hover": { boxShadow: 3 },
                                }}
                              >
                                <CardContent>
                                  <Typography>{task.content}</Typography>
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
    </Container>
  );
};

export default App;
