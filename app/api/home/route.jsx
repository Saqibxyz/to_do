import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";
const prisma = new PrismaClient();
// GET: Retrieve tasks for the authenticated user
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const tasks = await prisma.task.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(tasks);
    } catch (error) {
        return NextResponse.json(
            { message: "Error fetching tasks", error: error.message },
            { status: 500 }
        );
    }
}
// POST: Add a new task
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { title, status } = await request.json();
        if (!title) {
            return NextResponse.json({ message: "Title is required" }, { status: 400 });
        }
        const newTask = await prisma.task.create({
            data: { userId, title, status: status || false },
        });
        return NextResponse.json({ newTask });
    } catch (error) {
        return NextResponse.json(
            { message: "Error adding task", error: error.message },
            { status: 400 }
        );
    }
}
// PATCH: Update a task
export async function PATCH(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { id, title } = await request.json();
        if (!id || !title) {
            return NextResponse.json({ message: "Invalid input" }, { status: 400 });
        }
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            return NextResponse.json(
                { message: "Task not found or unauthorized" },
                { status: 404 }
            );
        }
        const updatedTask = await prisma.task.update({
            where: { id },
            data: { title },
        });
        return NextResponse.json({ updatedTask });
    } catch (error) {
        return NextResponse.json(
            { message: "Error updating task", error: error.message },
            { status: 400 }
        );
    }
}
// DELETE: Delete a task
export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: "Invalid task ID" }, { status: 400 });
        }
        const task = await prisma.task.findUnique({ where: { id } });
        if (!task || task.userId !== userId) {
            return NextResponse.json(
                { message: "Task not found or unauthorized" },
                { status: 404 }
            );
        }
        await prisma.task.delete({ where: { id } });
        return NextResponse.json({ message: "Task deleted successfully" });
    } catch (error) {
        return NextResponse.json(
            { message: "Error deleting task", error: error.message },
            { status: 400 }
        );
    }
}
