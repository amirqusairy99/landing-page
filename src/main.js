import './style.css'
import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import { createIcons, icons } from 'lucide'

window.Alpine = Alpine
Alpine.plugin(persist)

Alpine.data('demoApp', function () {
    return {
        tab: this.$persist('dashboard').as('demo_tab_v2'),
        activities: this.$persist([
            { id: 101, text: '<span class="font-semibold text-foreground">Dr. Ahmad Zaki</span> graded <span class="text-primary font-medium">Red-Black Tree Implementation</span>', time: '5 mins ago' },
            { id: 102, text: '<span class="font-semibold text-foreground">You</span> moved task <span class="text-primary font-medium">Design System Diagrams</span> to In Progress', time: '12 mins ago' },
            { id: 103, text: '<span class="font-semibold text-foreground">Sarah Lee</span> uploaded <span class="text-primary font-medium">Architecture_v2.pdf</span>', time: '1 hour ago' },
            { id: 104, text: '<span class="font-semibold text-foreground">You</span> completed task <span class="text-primary font-medium">Setup API Routes</span>', time: '2 hours ago' },
            { id: 105, text: '<span class="font-semibold text-foreground">Ts. Khairul Anwar</span> commented on <span class="text-primary font-medium">E-Commerce Platform MVP</span>', time: '4 hours ago' },
            { id: 106, text: '<span class="font-semibold text-foreground">Hafizuddin</span> created workspace <span class="text-primary font-medium">Network Topology</span>', time: 'Yesterday' },
            { id: 107, text: '<span class="font-semibold text-foreground">You</span> added 3 new tasks to <span class="text-primary font-medium">Custom Shell Development</span>', time: 'Yesterday' },
            { id: 108, text: '<span class="font-semibold text-foreground">Sarah Lee</span> joined the workspace <span class="text-primary font-medium">Neural Network Project</span>', time: '2 days ago' },
            { id: 109, text: '<span class="font-semibold text-foreground">Dr. Liew Chee Sun</span> extended deadline for <span class="text-primary font-medium">AI Assignment 1</span>', time: '3 days ago' },
            { id: 110, text: '<span class="font-semibold text-foreground">You</span> achieved <span class="text-primary font-medium">100% Completion</span> for Week 5 Lab', time: '4 days ago' }
        ]).as('demo_activities_v2'),
        tasks: this.$persist([
            { id: 1, title: 'Draft Project Proposal', priority: 'high', status: 'todo', due: 'Oct 10' },
            { id: 2, title: 'Gather Requirements', priority: 'medium', status: 'doing', due: 'Oct 12' },
            { id: 3, title: 'Setup Development Environment', priority: 'high', status: 'done', due: 'Sep 15' },
            { id: 4, title: 'Design Database Schema', priority: 'high', status: 'doing', due: 'Oct 1' },
            { id: 5, title: 'Implement Authentication', priority: 'high', status: 'doing', due: 'Oct 3' },
            { id: 6, title: 'Create UI Wireframes', priority: 'medium', status: 'doing', due: 'Oct 5' },
            { id: 7, title: 'Write Shell Parser in C', priority: 'high', status: 'todo', due: 'Oct 10' },
            { id: 8, title: 'Train MNIST Model', priority: 'high', status: 'todo', due: 'Oct 12' },
            { id: 9, title: 'Build React Dashboard', priority: 'medium', status: 'todo', due: 'Oct 15' },
            { id: 10, title: 'Write Final Report', priority: 'low', status: 'todo', due: 'Oct 20' },
            { id: 11, title: 'Prepare Presentation Slides', priority: 'medium', status: 'todo', due: 'Oct 25' },
            { id: 12, title: 'Refactor Auth Middleware', priority: 'low', status: 'todo', due: 'Nov 1' },
            { id: 13, title: 'Add Unit Tests for API', priority: 'medium', status: 'todo', due: 'Nov 5' },
            { id: 14, title: 'Deploy to Vercel/Render', priority: 'high', status: 'todo', due: 'Nov 10' }
        ]).as('demo_tasks_v2'),
        folders: this.$persist(['Lectures', 'Tutorials', 'Lab', 'Submissions', 'Project Assets', 'References', 'Drafts', 'UI Mockups']).as('demo_folders_v2'),
        
        // Ephemeral UI State
        sidebarOpen: false,
        showAddTask: false,
        newTaskTitle: '',
        newTaskPriority: 'medium',
        showAddFolder: false,
        newFolderName: '',
        
        // Drag and Drop State
        draggedTaskId: null,
        dragOverColumn: null,

        getStats() {
            const pendingTasks = this.tasks.filter(t => t.status === 'todo' || t.status === 'doing').length;
            const completedTasks = this.tasks.filter(t => t.status === 'done').length;
            const assignments = 18; 
            const overdueTasks = 3; 

            return [
                { 
                    title: 'Pending', value: pendingTasks.toString(), icon: 'clock', 
                    hoverBorderClass: 'hover:border-amber-500/30', bgGlowClass: 'bg-amber-500/10 group-hover:bg-amber-500/20', iconBgClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-500' 
                },
                { 
                    title: 'Completed', value: completedTasks.toString(), icon: 'check-circle', 
                    hoverBorderClass: 'hover:border-green-500/30', bgGlowClass: 'bg-green-500/10 group-hover:bg-green-500/20', iconBgClass: 'bg-green-500/10 text-green-600 dark:text-green-500' 
                },
                { 
                    title: 'Assignments', value: assignments.toString(), icon: 'book-open', 
                    hoverBorderClass: 'hover:border-blue-500/30', bgGlowClass: 'bg-blue-500/10 group-hover:bg-blue-500/20', iconBgClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-500' 
                },
                { 
                    title: 'Overdue', value: overdueTasks.toString(), icon: 'alert-circle', 
                    hoverBorderClass: 'hover:border-red-500/30', bgGlowClass: 'bg-red-500/10 group-hover:bg-red-500/20', iconBgClass: 'bg-red-500/10 text-red-600 dark:text-red-500' 
                }
            ];
        },

        getUpcomingTasks() {
            return this.tasks.filter(t => t.status !== 'done').slice(0, 5);
        },
        
        addTask() {
            if(!this.newTaskTitle.trim()) return;
            this.tasks.push({
                id: Date.now(),
                title: this.newTaskTitle,
                priority: this.newTaskPriority,
                status: 'todo',
                due: 'TBD'
            });
            this.addActivity('added a new task: <span class="text-primary font-medium">' + this.newTaskTitle + '</span>');
            this.newTaskTitle = '';
            this.showAddTask = false;
            setTimeout(() => { createIcons({icons}); }, 50);
        },

        deleteTask(id) {
            const taskIndex = this.tasks.findIndex(t => t.id === id);
            if(taskIndex > -1) {
                const title = this.tasks[taskIndex].title;
                this.tasks.splice(taskIndex, 1);
                this.addActivity('deleted task <span class="text-primary font-medium">' + title + '</span>');
            }
        },

        // New Drag and Drop Methods
        startDrag(event, id) {
            this.draggedTaskId = id;
            event.dataTransfer.effectAllowed = 'move';
            // Allow the browser to snap a clone before setting opacity
            setTimeout(() => {
                event.target.classList.add('opacity-50', 'scale-95');
            }, 10);
        },
        
        endDrag(event) {
            event.target.classList.remove('opacity-50', 'scale-95');
            this.draggedTaskId = null;
            this.dragOverColumn = null;
        },
        
        onDrop(status) {
            if (this.draggedTaskId) {
                const task = this.tasks.find(t => t.id === this.draggedTaskId);
                if (task && task.status !== status) {
                    task.status = status;
                    const niceStatus = status === 'todo' ? 'To Do' : (status === 'doing' ? 'In Progress' : 'Done');
                    this.addActivity('moved task <span class="text-primary font-medium">' + task.title + '</span> to ' + niceStatus);
                }
            }
            this.dragOverColumn = null;
        },

        addFolder() {
            if(!this.newFolderName.trim()) return;
            this.folders.push(this.newFolderName);
            this.addActivity('created folder <span class="text-primary font-medium">' + this.newFolderName + '</span>');
            this.newFolderName = '';
            this.showAddFolder = false;
            setTimeout(() => { createIcons({icons}); }, 50);
        },

        deleteFolder(folderName) {
            this.folders = this.folders.filter(f => f !== folderName);
            this.addActivity('deleted folder <span class="text-primary font-medium">' + folderName + '</span>');
        },

        addActivity(text) {
            this.activities.unshift({
                id: Date.now(),
                text: '<span class="font-semibold text-foreground">Demo User</span> ' + text,
                time: 'Just now'
            });
            if (this.activities.length > 15) this.activities.pop();
        },

        resetDemo() {
            if(confirm("Are you sure you want to clear your local storage and reset the demo?")) {
                localStorage.clear();
                window.location.reload();
            }
        },

        lucideIcon(name) {
            return `<i data-lucide="${name}" class="w-6 h-6"></i>`;
        },

        init() {
            this.$watch('tab', () => {
                setTimeout(() => { createIcons({icons}); }, 50);
            });
            this.$watch('tasks', () => {
                setTimeout(() => { createIcons({icons}); }, 50);
            }, { deep: true });
            
            setTimeout(() => { createIcons({icons}); }, 50);
        }
    }
});

Alpine.start();
createIcons({icons});
