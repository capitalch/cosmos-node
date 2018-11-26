let sql = {
    "select:patient-details": `
    select 
        "id"
        , "firstName"
        , "lastName"
        , "clinicianName"
        , "responses"
        , "appointmentDate"
        , "appointmentTime"
        , "completedDate"
        , "status"
        , "edssScore"
        , "carryBag"
        , "gender"
        , "qxCode"
        , "edssScore"
        , "symptoms"
        , "qxType"
            from apidata where "qxCode" = %L
    `
    , "update:patient-details": `
        update apidata
            set 
            "responses" =  %L
            , "carryBag" = %L
            , "status" = %L
                where "qxCode" = %L
    `

    , "select:edss-and-symptoms": `
    select "edssScore", "symptoms"
        from apidata where "qxCode"=%L
    `
    , "complete:patient-details":`
        update apidata
            set "status" = 'completed'
            , "completedDate" = NOW()
                where "qxCode" = %L
    `
    
    , "reset:patient-details:code":`
        update apidata
            set "responses" = null
            , "completedDate" = %L
            , "status" = %L
            , "carryBag" = null
        where "qxCode" = %L
    `

    , "reset:patient-details":`
        update apidata
            set "responses" = null
            , "completedDate" = null
            , "status" = null
            , "carryBag" = null
        where "patientId" = 1111;

        update apidata
            set "responses" = null
            , "completedDate" = '2017-08-01'
            , "status" = 'started'
            , "carryBag" = null
        where "patientId" = 1112;

        update apidata
            set "responses" = null
            , "completedDate" = '2018-08-16'
            , "status" = null
            , "carryBag" = null
        where "patientId" = 1113;
    `

    , "test": `select * from test
    `
}
module.exports = sql;