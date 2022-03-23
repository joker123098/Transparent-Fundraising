;; Must be able to:
;;  Register a campaign
;;  Register a donor
;;  Recieve donation from donor.
;;  See all transactions to a campaign 


(define-constant error-general (err u1))
(define-constant error-campaign-not-found (err u2))
(define-constant error-donor-registration-failure (err u3))
(define-constant error-donor-not-approved (err u4))
(define-constant error-miamicoin-transaction-failure (err u5))
(define-constant error-miamicoin-donor-update-failure (err u6))
(define-constant error-couldnt-get-campaigns (err u7))



;; Optimize the get all donors/campaigns functions in the future by using incrementing integers as keys, this there is no arbitrary limit as used here. 
(define-data-var all-recipients (list 1000 principal) (list))
(define-data-var all-donors (list 1000 (tuple (recipient principal) (donor principal))) (list))

(define-map campaign-map { recipient: principal } { name: (string-ascii 50), recieved: uint, url: (string-ascii 50), recipient: principal })
(define-map approved-donors { recipient: principal, donor: principal} {name: (string-ascii 50), contributions: uint, recipient: principal, donor: principal})

(define-read-only (get-current-campaign) 
    (map-get? campaign-map {recipient: tx-sender}))

(define-public (register-campaign (name (string-ascii 50)) (url (string-ascii 50)))
    (if 
        (and 
            (map-insert campaign-map {recipient: tx-sender} {name: name, recieved: u0, url: url, recipient: tx-sender}) 
            (var-set all-recipients (default-to (list) (as-max-len? (append (var-get all-recipients) tx-sender) u1000))))
        (ok "Campaign registered") 
        error-general))

(define-public (register-donor (name (string-ascii 50)) (donor principal))
    (if (is-none (map-get? campaign-map {recipient: tx-sender})) 
        error-campaign-not-found 
        (if (and 
                (map-insert approved-donors {recipient: tx-sender, donor: donor} {name: name, contributions: u0, recipient: tx-sender, donor: donor})
                (var-set all-donors (default-to (list) (as-max-len? (append (var-get all-donors) (tuple (recipient tx-sender) (donor donor))) u1000))))
            (ok "Donor registered")
            error-donor-registration-failure)))

(define-public (process-donation-stx (recipient principal) (amount uint)) 
    (if (is-none (map-get? approved-donors {recipient: recipient, donor: tx-sender}))
        error-donor-not-approved
        (stx-transfer? amount tx-sender recipient)))


(define-public (process-donation-mia (recipient principal) (amount uint)) 
    (if (is-none (map-get? approved-donors {recipient: recipient, donor: tx-sender}))
        error-donor-not-approved
        (send-mia recipient amount)))

(define-private (send-mia (recipient principal) (amount uint)) 
    (if (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-token send-many 
        (default-to (list) (as-max-len? 
            (list {to: recipient, amount: amount, memo: none}) 
            u200))))
            (if 
                (and 
                    (map-set approved-donors {recipient: recipient, donor: tx-sender} {
                        name: (default-to "" (get name (map-get? approved-donors {recipient: recipient, donor: tx-sender}))),
                        contributions: (+
                            (default-to u0 (get contributions (map-get? approved-donors {recipient: recipient, donor: tx-sender})))
                            amount
                            ), 
                        recipient: recipient,
                        donor: tx-sender
                            }
                        )
                    (map-set campaign-map {recipient: recipient} {
                        name: (default-to "" (get name (map-get? campaign-map {recipient: recipient}))),
                        recieved: (+
                            (default-to u0 (get recieved (map-get? campaign-map {recipient: recipient})))
                            amount
                            ),
                        url: (default-to "" (get url (map-get? campaign-map {recipient: recipient}))),
                        recipient: recipient})
                    )
                (ok "Donation approved and executed")
                error-miamicoin-donor-update-failure
            )
            error-miamicoin-transaction-failure
            ))

(define-read-only (get-donor-info (donor principal) (recipient principal)) 
    (map-get? approved-donors {recipient: recipient, donor: donor})
    )
    
(define-read-only (get-campaign-info  (recipient principal)) 
    (map-get? campaign-map {recipient: recipient})
    )

(define-private (filter-is-a-campaign (item (optional (tuple (name (string-ascii 50)) (recieved uint) (recipient principal) (url (string-ascii 50))))))
  (is-some item))


(define-read-only (get-all-campaigns) 
    (filter filter-is-a-campaign (map get-campaign-info (var-get all-recipients)))
    )

(define-private (filter-is-a-donor (item (optional (tuple (contributions uint) (donor principal) (name (string-ascii 50)) (recipient principal)))))
  (is-some item))
(define-read-only (get-donor-info-with-tuple (tuple-param (tuple (donor principal) (recipient principal)))) 
    (map-get? approved-donors {recipient: (get recipient tuple-param), donor: (get donor tuple-param)})
    )

(define-read-only (get-all-donors) 
    (filter filter-is-a-donor (map get-donor-info-with-tuple (var-get all-donors)))
)


;; For testing/demo purposes
(define-public (make-miami-coin)
    (if (or    
        (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-auth initialize-contracts .miamicoin-core-v1))
        (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-core-v1 register-user none))
    )
        (ok "done")
        error-general
    ))
(define-public (mint-miami-coin)
    (if (and
        (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-token mint u100 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5))
        (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-token mint u100 'ST2G0KVR849MZHJ6YB4DCN8K5TRDVXF92A664PHXT))
        (is-ok (contract-call? 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.miamicoin-token mint u100 'ST21HQTGHGJ3DDWM8BC1E00TYZPD3DF31NSK0Y1JS))
    ) (ok "done") error-general)
    )
