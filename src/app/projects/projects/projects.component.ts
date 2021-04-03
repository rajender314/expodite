import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Project } from '../project';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    projects: Project[];
    selectedProject: Project;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.fetchProjects();
    }

    fetchProjects() {
        this.projects = [
            { id: '1111', name: "Sams Club Holiday Offers" },
            { id: '2222', name: "Black Friday Sales" },
            { id: '3333', name: "Sams Holiday Sales" }
        ];
        
        if (this.projects.length) {
            this.selectProject(this.projects[0]);
        }
    }

    selectProject(project) {
        this.selectedProject = project;
    }

}
