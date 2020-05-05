//This file contains all the fucntions that we would use with
// proper documentation for which purpose and efficiency it is to be used

//Import all models for use all the time
const student = require('../models/Student');
const JSONStream = require( "JSONStream" );


//This function is usued to adhere to post for notes
exports.addStudent = async (req , res , next)=>{
    //Save to mongo collection
    try{
       const result = await student.create(req.body);
       console.log(result);
       res.status(200).send("Note saved");
    }catch(err){
        console.log(err);
        next(err);
    }
}

exports.getStudents = async (req , res , next)=>{
    try{
     //Use streams to get data efficiently
    const stream = student.find().cursor();
    //Pipe to respone
    stream.pipe(JSONStream.stringify()).pipe(res.type('json'));
    }catch(err){
      console.log(err);
    }
}

exports.deletePost = async (req , res , next)=>{
    try {
        //Delete by id
        const result = await student.findByIdAndDelete(req.params.id);
        res.send("Post deleted");
        console.log("Deleted");
    } catch (err) {
        console.log(err);
    }
}


exports.topThreeSchools = async(req , res , next)=>{
   try {

    console.log(req.query.result_type );
       const data =  await student.aggregate([
        {
            $project :{
                school_id : '$school.name',
                districtFrom : "$school.district",
                avgScore :  {
                   $cond : {
                       if :{$eq :[req.query.result_type  , 'annual']},
                       then : {$avg : "$subject.annual"},
                       else : {$avg : "$subject.quaterly"}
                   }
               },
            }
        },
        {
            $group : {
                _id : "$school_id",
                district : {
                    $first : "$districtFrom"
                },
                avg : {$avg : "$avgScore"}
            }
        },
        {
            $sort : {avg : -1}
        },
        {
            $limit : 6
        }
    ]).exec();

    res.status(200).send(data);
   } catch (error) {
       res.status(400).send(error);
   }
}

exports.topThreeSchoolsByDistrict = async(req , res , next)=>{
     
    try {
        const data  = await student.aggregate([
            {
                $match :{
                    'school.district' : req.query.district
                }
            },
             {
                 $project :{
                     school_id : '$school.name',
                     districtFrom : "$school.district",
                     avgScore :  {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                 }
             },
             {
                 $group : {
                     _id : "$school_id",
                     districtFrom : {
                         $first : "$districtFrom"
                     },
                     avgScore :  {$avg : "$avgScore"}
                 }
             },

            {
                $sort : {avgScore : -1}
            },
            {
                $limit : 3
            }
    
    
    
    ]).exec();

    res.status(200).send(data);

    } catch (error) {
        res.status(400).send(error);
    }
}

exports.topThreeStudents = async(req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1,
                    district : "$school.district"
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 3
            }
    
        ]).exec();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

}

exports.topTenStudentsByDistrict = async(req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.district' : req.query.district}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 10
            }
    
        ]).exec();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}


exports.topTenStudentInSchool = async(req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.name' : req.query.name}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    name_of_student : 1,
                    school : 1
                }
            },
            //now sort in decending
            { $sort :{avg :-1}},
            //limit the results to
            {
                $limit : 10
            }
    
        ]).exec();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}


exports.BestStudent = async(req , res , next)=>{

    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'school.name' : req.query.name}
            },
            {
                $project: {
                    _id: 1,
                    avg : {
                        $cond : {
                            if :{$eq :[req.query.result_type  , 'annual']},
                            then : {$avg : "$subject.annual"},
                            else : {$avg : "$subject.quaterly"}
                        }
                    },
                    subject : 1,
                    name_of_student : 1,
                    school : 1
                }
            },
            
            {
                $max : "$avg"
            }
    
        ]).exec();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}

exports.BestStudentBySubject = async(req , res , next)=>{

    console.log(req.query.name);
    //Get top 3 students
    try{
        const data = await student.aggregate([
            {
                $match: {'subject.subject' : req.query.name}
            },

            {
                $project: {
                    _id: 1,
                    requestedSubjectMarks : {
                        $filter: {
                            input: '$subject',
                            as: 'requiredSubject',
                            cond: {$eq: ['$$requiredSubject.subject', req.query.name]}
                        }
                    },
                    marks : {
                        $arrayElemAt: [ "$requiredSubject", 0 ]
                    } ,
                    name_of_student : 1,
                    school : 1
                }
            },

           
             //now sort in decending
             { $sort :{"requestedSubjectMarks" : -1}},
             //limit the results to
             {
                 $limit : 3
             }
     

    
        ]).exec();
        res.send(data);
    }catch(error){
        console.log(error);
        res.status(400).send(error);
    }

    

}