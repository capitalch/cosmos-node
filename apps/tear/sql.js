let sql = {
    hours:`
    select r.FullName, ProjectName, Date=CAST(Date AS DATE),   
Billable=SUM(ActualWorkBillable), c.ClassName
	from NWTA_TimeSheet t
		join NWTA_Resource r
			on r.ResourceUID = t.OwnerResourceUID
		join NWTA_TimesheetLine l
			on l.TimesheetUID = t.TimesheetUID

		join NWTA_TimesheetClass c
			on l.ClassID = c.TimesheetClassID

		join NWTA_TimesheetActual a
			on a.TimesheetLineUID = l.TimesheetLineUID
		join NWTA_Assignment n
			on n.AssignmentUID = l.AssignmentUID
		join NWTA_Task s
			on s.TaskUID = n.TaskUID
		join NWTA_Project pr
			on pr.ProjectUID = s.ProjectUID			
	where 	
		a.Date >= '{{dateFrom}}'
		and a.Date <= '{{dateTo}}'
		and (ActualWorkBillable > 0)
		-- and classID = 1
	GROUP by r.FullName, ProjectName, Date, ClassName
	order by r.FullName, Date
    `
};
module.exports = sql;