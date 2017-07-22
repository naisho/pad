import { Component } from '@angular/core';
import { Http } from '@angular/http';

import { DataService } from './shared/data.service';
import { DictionaryService } from './shared/dictionary.service';
import { ParseService } from './parse.service';
import { InterpretService } from './interpret.service';

import { TeamService } from '../shared/team.service';
import { Monster }			from '../shared/monster';
import { Team }             from '../shared/team';


enum Attribute {
	fire = 0,
	water,
	wood,
	light,
	dark
}


@Component({
	selector: 'leader-skill',
	providers: [ DataService, DictionaryService, ParseService, InterpretService ],
	templateUrl: './app/LeaderSkill/leaderSkill.component.html'

})

export class LeaderSkillComponent {
	constructor(private InterpretService: InterpretService, private DataService: DataService, private DictionaryService: DictionaryService, private teamService: TeamService) {};
	dictionary = this.DictionaryService.getDictionary();
	ls = {};
	team: Team;
	attributeWeight: number[];
	primaryAttributeIndex: number;
	// console.log(this.teamService.team);

	getSampleData() {
		var data = this.DataService.getDescriptions();
		// var data = this.teamService.team;
		// console.log("team:",this.teamService.getTeam());

		var keys = this.DataService.getKeys();
        var sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

		// split sentence
		for (let key of keys) {
			data[key] = data[key].match(sentence)
            this.ls[key] = this.InterpretService.interpret_descs(data[key]);
            // ls is an object with Monsters as keys and leader skill types as properties
		}
		
		console.table(this.ls);
		// return this.ls;
	}

	processLeaderSkill() {
		if (this.team.leader && this.team.friend_leader) {
			let sentence = /[^\.\s].+?(?=\.\s|\.$)/g; // http://regexr.com/3fj70

			// split sentence
			["leader","friend_leader"].forEach((slot,i) => {
				// split leader skill into array of sentences
				let ls = this.team[slot].leader_skill_desc.match(sentence);
				this.ls[slot] = this.InterpretService.interpret_descs(ls);
			});

			console.table(this.ls);
		}
	}

	getMoreInfo(team: Team) {
	    let moveOptions: string[];
	    this.attributeWeight = [0, 0, 0, 0, 0];

	    ["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
            if (this.team[slot] != undefined && this.team[slot].hasOwnProperty("element")) {
            	// console.log(this.team[slot].name,this.team[slot].element);
            	this.attributeWeight[this.team[slot].element] += 10*(this.team[slot].atk);

            	if (this.team[slot].element == this.team[slot].element2) {
            		this.attributeWeight[this.team[slot].element2] += 1*(this.team[slot].atk);
            	} else if (this.team[slot].element2 != null) {
            		this.attributeWeight[this.team[slot].element2] += 3*(this.team[slot].atk);
            	}
            }
        });

	    this.primaryAttributeIndex = this.attributeWeight.indexOf(Math.max.apply(null,this.attributeWeight));

	    if (this.team.leader) { console.log("primary attribute: ",Attribute[this.primaryAttributeIndex]); }
	    // console.log(Attribute);

        // console.log();
	}

	generateCobmoList(team: Team) {
	    console.log("Generating combo list for",team.leader.name);

		let leader_skill = team.leader.leader_skill_desc;	    

		// tpaTeam?
		// rowTeam > 5 rows

		// color cross, heart cross then add cross

		// flex match, color match, add all colors

		// connected orbs, add min to max connected orbs

		// combo count, conditional, ????




        if (leader_skill['conditional'] != undefined) {
            // if unconditional array has colors with attack multiplier
            // add 1c, 2c, 3c combinations for those colors
            // example: blue, dark
            // return: [blue], [blue, blue], [blue, blue, blue]
            // [dark], [blue, dark], [blue, dark tpa], [dark tpa, blue]
        }
        
        if (leader_skill['color match'] != undefined) {
            // consider minimum activation, then add 1c 2c main attribute and sub attribute
        }
        
        if (leader_skill['color cross'] != undefined) {
            // consider 1, 2 and 3 cross
        }
        
        if (leader_skill['combo count'] != undefined) {
            // consider range of combo count
        }
        
        if (leader_skill['flex match'] != undefined) {
            // -_-
        }
        
        if (leader_skill['heart cross'] != undefined) {
            // consider with and without heart cross
        }
        
        if (leader_skill['connected orbs'] != undefined) {
            // consider range of connected orbs
        }
	}

	estimateMultiplier(team: Team) {
		// combine all awakenings into one array
		let combinedTeamAwakenings: number[] = [];

		["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
			if (team[slot] != undefined && team[slot].hasOwnProperty("awoken_skills")) {
				team[slot].awoken_skills.forEach((awakening: number, j: number) => {
					if (team[slot].awakening > j) {
						combinedTeamAwakenings.push(team[slot].awoken_skills[j]);
					}
				});
			}
		});
		
		// console.log(combinedTeamAwakenings.filter(element => {return element == 27}).length); // awakening 27 is tpa
		// fire oe 14, water 15, wood 16, light 17, dark 18



		// get number of row awakenings


		// if < 5 row awakenings
			// calculate 1c of each attribute, and apply conditional multipliers
			// group 1
				// loop through subs
				let teamDamage: number = 0;
				["leader", "sub1", "sub2", "sub3", "sub4", "friend_leader"].forEach((slot,i) => {
					if (team[slot] != undefined && team[slot].hasOwnProperty("atk")) {
						if (team[slot].element == this.primaryAttributeIndex) {
							// primary attribute
							let mainOrSubMultiplier: number = 1.00;
							let orbEnhanceAwakenings: number = combinedTeamAwakenings.filter(element => {return element == this.team[slot].element+13}).length;
							let connectedOrbs: number = 3;

							let enhancedOrbs:number = 0;
							if (orbEnhanceAwakenings >= 5) {
								enhancedOrbs = 3;
							} else if (orbEnhanceAwakenings == 4) {
								enhancedOrbs = 2;
							} else if (orbEnhanceAwakenings >= 2) {
								enhancedOrbs = 1;
							}

							let damage: number = team[slot].atk * mainOrSubMultiplier * (1.00 + enhancedOrbs*0.06) * (1.00 + (0.25 * (connectedOrbs-3)) * (1+ orbEnhanceAwakenings*0.05));
							damage = Math.ceil(damage);
							// apply conditional multpliers

							teamDamage += damage;
							console.log("primary attribute damage for",team[slot].name,damage);
						}

						if (team[slot].element2 == this.primaryAttributeIndex) {
							// sub-attribute
							let mainOrSubMultiplier: number = 0.3;
							let orbEnhanceAwakenings: number = combinedTeamAwakenings.filter(element => {return element == this.team[slot].element2+13}).length;
							let connectedOrbs: number = 3;

							let enhancedOrbs:number = 0;
							if (orbEnhanceAwakenings >= 5) {
								enhancedOrbs = 3;
							} else if (orbEnhanceAwakenings == 4) {
								enhancedOrbs = 2;
							} else if (orbEnhanceAwakenings >= 2) {
								enhancedOrbs = 1;
							}
	
							let damage = team[slot].atk * mainOrSubMultiplier * (1.00 + enhancedOrbs*0.06) * (1.00 + (0.25 * (connectedOrbs-3)) * (1+ orbEnhanceAwakenings*0.05));
							damage = Math.ceil(damage);
							teamDamage += damage;
							console.log("sub-attribute damage for",team[slot].name,damage);
						}

					console.log("need multiplier of ",200000/teamDamage,"for 200,000");

					}

				});



					for (const attribute in Attribute) {
						if (Number(attribute) >= 0) { // check type correctly in typescript?
							// console.log(Attribute[attribute],attribute)

						}
					}



				// }

			// calculateMatchDamage(monster: Monster, team: Team);
				// get number of orb enhance awakenings


			// group 2
		// else ...
			// calculate 1c of each attribute, apply conditional multipliers, 1 2 and 3 rows
	}

	initialize() {
		this.teamService.subject
            .subscribe(
                response => {
                	this.team = response;
                	this.getMoreInfo(response);
                	this.processLeaderSkill();
                	this.estimateMultiplier(response);
                	console.log("<leader-skill> updated", response);
                },
                function(error) {
                    console.log("Error happened: " + error)
                },
                () => {
                    console.log("subscribed to team.service");
                }
        );
	}

	ngOnInit() {
		this.initialize();

		// this.getSampleData();
	}
}